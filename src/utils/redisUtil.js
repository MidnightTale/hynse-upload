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
    const fileDataString = JSON.stringify(fileData);
    await redis.set(fileId, fileDataString, 'EX', expiration);
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
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`Failed to retrieve file metadata: ${error.message}`);
  }
};

export const storeSessionKey = async (ip, sessionId, encryptedKey, salt) => {
  await redis.set(`session:${ip}:${sessionId}`, JSON.stringify({ encryptedKey, salt }), 'EX', 3600);
  logInfo('Session key stored', { ip, sessionId });
};

export const validateSessionKey = async (ip, sessionId, providedKey, providedSalt) => {
  const result = await redis.get(`session:${ip}:${sessionId}`);
  if (!result) {
    logWarn('Session key not found', { ip, sessionId });
    return false;
  }

  const { encryptedKey, salt } = JSON.parse(result);
  if (salt !== providedSalt) {
    logWarn('Invalid salt provided', { ip, sessionId });
    return false;
  }

  const hashedProvidedKey = crypto.scryptSync(providedKey, salt, 32).toString('hex');
  const isValid = hashedProvidedKey === encryptedKey;
  logInfo('Session key validated', { ip, sessionId, isValid });
  return isValid;
};

export const getSessionKey = async (ip, sessionId) => {
  const result = await redis.get(`session:${ip}:${sessionId}`);
  if (!result) {
    logWarn('Session key not found', { ip, sessionId });
    return null;
  }
  return JSON.parse(result);
};

export default redis;