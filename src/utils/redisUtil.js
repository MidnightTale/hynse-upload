// This utility provides a Redis client and functions to check the Redis connection status.

import Redis from 'ioredis';
import config from '../../config';

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

export const storeFileChunk = async (fileId, chunkNumber, chunkData, expiration) => {
  try {
    await redis.setex(`file:${fileId}:chunk:${chunkNumber}`, expiration, chunkData);
  } catch (error) {
    throw new Error(`Failed to store file chunk: ${error.message}`);
  }
};

export const finalizeFileUpload = async (fileId, metadata, expiration) => {
  try {
    await redis.setex(`file:${fileId}:metadata`, expiration, JSON.stringify(metadata));
  } catch (error) {
    throw new Error(`Failed to finalize file upload: ${error.message}`);
  }
};

export const getFile = async (fileId) => {
  try {
    const metadata = await redis.get(`file:${fileId}:metadata`);
    if (!metadata) {
      return null;
    }

    const parsedMetadata = JSON.parse(metadata);
    const totalChunks = Math.ceil(parsedMetadata.fileSize / (1024 * 1024));
    const fileData = Buffer.concat(await Promise.all(
      Array.from({ length: totalChunks }, (_, i) => 
        redis.getBuffer(`file:${fileId}:chunk:${i}`)
      )
    ));

    return { fileData, metadata: parsedMetadata };
  } catch (error) {
    throw new Error(`Failed to retrieve file data: ${error.message}`);
  }
};

export default redis;