// @perama: This service handles file-related operations using Redis for temporary storage.
// It provides functions for listing files and implements error handling.

import { nanoid } from 'nanoid';
import redis from '../utils/redisUtil';
import appConfig from '../../config';
import { logInfo, logError, logWarn, logDebug } from '../utils/logUtil';

/**
 * List all files stored in Redis.
 * @returns {Promise<Array>} A promise that resolves to an array of file metadata.
 * 
 * ! Alert: This function retrieves all keys from Redis, which may be inefficient for large datasets.
 * TODO: Implement pagination or chunking for better performance with large numbers of files.
 */
export const listFiles = async () => {
  try {
    // * Highlight: Retrieve all keys from Redis
    const keys = await redis.keys('*');
    
    // * Highlight: Map over keys to get file data and parse JSON
    const files = await Promise.all(keys.map(async (key) => {
      const fileData = await redis.get(key);
      return JSON.parse(fileData);
    }));
    
    return files;
  } catch (error) {
    // ! Alert: Log error and throw a generic error to avoid exposing internal details
    logError('Error listing files', error);
    throw new Error('Internal Server Error');
  }
};

// @param keys: Array of Redis keys representing stored files
// @param fileData: JSON string containing file metadata