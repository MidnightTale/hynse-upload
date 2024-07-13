// @perama: This utility provides Redis client and functions to check the Redis connection status.

import Redis from 'ioredis';
import config from '../../config';
import { write } from 'fs';

const redis = new Redis(config.redis);

/**
 * Check the Redis connection status.
 * @returns {Promise<void>}
 * @throws {Error} If the connection fails
 */
export const checkRedisStatus = async () => {
  try {
    // * Highlight: Attempt to ping Redis server
    await redis.ping();
  } catch (error) {
    // ! Alert: Redis connection failed
    throw error;
  }
};

/**
 * Store file metadata in Redis.
 * @param {string} fileId - The ID of the file
 * @param {Object} fileData - The metadata of the file
 * @param {number} expiration - The expiration time in seconds
 * @returns {Promise<void>}
 * @throws {Error} If storing metadata fails
 */
export const storeFileMetadata = async (fileId, fileData, expiration) => {
  try {
    // * Highlight: Convert fileData to JSON string
    const fileDataString = JSON.stringify(fileData);
    // * Highlight: Set key-value pair in Redis with expiration
    await redis.set(fileId, fileDataString, 'EX', expiration);
  } catch (error) {
    // ! Alert: Failed to store file metadata
    throw new Error(`Failed to store file metadata: ${error.message}`);
  }
};

/**
 * Retrieve a file's metadata from Redis.
 * @param {string} id - The ID of the file
 * @returns {Promise<Object|null>} The file metadata or null if not found
 * @throws {Error} If retrieval fails
 */
export const getFile = async (id) => {
  try {
    // * Highlight: Attempt to get value from Redis
    const result = await redis.get(id);
    if (!result) {
      return null;
    }
    // * Highlight: Parse JSON string back to object
    return JSON.parse(result);
  } catch (error) {
    // ! Alert: Failed to retrieve file metadata
    throw new Error(`Failed to retrieve file metadata: ${error.message}`);
  }
};

// TODO: Implement a function to delete expired file metadata

// @param fileId: Unique identifier for the file in Redis
// @param fileData: Object containing file metadata
// @param expiration: Time in seconds after which the metadata should expire
// @param id: Unique identifier to retrieve file metadata

export default redis;