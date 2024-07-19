// This utility provides a Redis client and functions to check the Redis connection status.

import Redis from 'ioredis';
import config from '../../config';
import { logInfo, logWarn } from './logUtil';
import crypto from 'crypto';

const redis = new Redis(config.redis);


/**
 * Check the Redis connection status.
 */
export const checkRedisStatus = async () => {
  try {
    await redis.ping();
  } catch (error) {
    throw error;
  }
};

/**
 * Store file metadata in Redis.
 * @param {string} fileId - The ID of the file.
 * @param {Object} fileData - The metadata of the file.
 * @param {number} expiration - The expiration time in seconds.
 */
export const storeFileMetadata = async (fileId, fileData, expiration) => {
  try {
    const serializedData = [
      `filePath:${fileData.filePath}`,
      `originalName:${fileData.originalName}`,
      `fileSize:${fileData.fileSize}`,
      `mimeType:${fileData.mimeType}`,
      `uploadedBy:${fileData.uploadedBy}`
    ].join('|');

    await redis.set(fileId, serializedData, 'EX', expiration);
  } catch (error) {
    throw new Error(`Failed to store file metadata: ${error.message}`);
  }
};

/**
 * Retrieve a file's metadata from Redis.
 * @param {string} id - The ID of the file.
 * @returns {Object|null} - The file metadata or null if not found.
 */
export const getFile = async (id) => {
  try {
    const result = await redis.get(id);
    if (!result) {
      return null;
    }
    const parsedResult = {};
    result.split('|').forEach(item => {
      const [key, value] = item.split(':');
      parsedResult[key] = value;
    });
    return parsedResult;
  } catch (error) {
    throw new Error(`Failed to retrieve file metadata: ${error.message}`);
  }
};

export const storeSessionKey = async (ip, sessionId, encryptedKey, salt) => {
  const sessionData = JSON.stringify({ encryptedKey, salt, usageCount: 0, lastHeartbeat: Date.now() });
  await redis.set(`${config.redis.keyPrefix.session}${ip}:${sessionId}`, sessionData, 'EX', config.session.expirationTime / 1000);
  logInfo('Session key stored', { ip, sessionId, encryptedKeyLength: encryptedKey.length, saltLength: salt.length });
};

export const validateSessionKey = async (ip, sessionId, providedKey, providedSalt, isHeartbeat = false) => {
  const result = await redis.get(`${config.redis.keyPrefix.session}${ip}:${sessionId}`);
  if (!result) {
    logWarn('Session key not found', { ip, sessionId });
    return false;
  }

  const { encryptedKey, salt, usageCount, lastHeartbeat } = JSON.parse(result);
  if (salt !== providedSalt) {
    logWarn('Invalid salt provided', { ip, sessionId });
    return false;
  }

  if (usageCount >= config.session.usageLimit && !isHeartbeat) {
    logWarn('Session key usage limit exceeded', { ip, sessionId, usageCount });
    await redis.del(`${config.redis.keyPrefix.session}${ip}:${sessionId}`);
    return false;
  }

  const currentTime = Date.now();
  if (currentTime - lastHeartbeat > config.session.expirationTime) {
    logWarn('Session key expired due to inactivity', { ip, sessionId, lastHeartbeat });
    await redis.del(`${config.redis.keyPrefix.session}${ip}:${sessionId}`);
    return false;
  }

  const hashedProvidedKey = crypto.scryptSync(providedKey, salt, 32).toString('hex');
  const isValid = hashedProvidedKey === encryptedKey;
  
  if (isValid) {
    await redis.set(`${config.redis.keyPrefix.session}${ip}:${sessionId}`, JSON.stringify({ 
      encryptedKey, 
      salt, 
      usageCount: isHeartbeat ? usageCount : usageCount + 1,
      lastHeartbeat: currentTime
    }), 'KEEPTTL');
  }

  logInfo('Session key validated', { ip, sessionId, isValid, usageCount: isHeartbeat ? usageCount : usageCount + 1 });
  return isValid;
};

export const updateHeartbeat = async (ip, sessionId) => {
  const result = await redis.get(`${config.redis.keyPrefix.session}${ip}:${sessionId}`);
  if (!result) {
    logWarn('Session key not found for heartbeat update', { ip, sessionId });
    return false;
  }

  const sessionData = JSON.parse(result);
  sessionData.lastHeartbeat = Date.now();
  await redis.set(`${config.redis.keyPrefix.session}${ip}:${sessionId}`, JSON.stringify(sessionData), 'KEEPTTL');
  logInfo('Heartbeat updated', { ip, sessionId, newLastHeartbeat: sessionData.lastHeartbeat });
  return true;
};

export const getSessionKey = async (ip, sessionId) => {
  const result = await redis.get(`${config.redis.keyPrefix.session}${ip}:${sessionId}`);
  if (!result) {
    logWarn('Session key not found', { ip, sessionId });
    return null;
  }
  const { encryptedKey, salt, usageCount } = JSON.parse(result);
  return { encryptedKey, salt, usageCount };
};

export default redis;