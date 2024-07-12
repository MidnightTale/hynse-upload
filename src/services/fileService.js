// This service handles file uploads and retrievals using Redis for temporary storage.
// It uses multithreading for file processing to enhance performance.

import { nanoid } from 'nanoid';
import redis from '../utils/redisUtil';
import appConfig from '../../config';
import { logInfo, logError, logWarn, logDebug } from '../utils/logUtil';

/**
 * List all files stored in Redis.
 * @returns {Array} - An array of file metadata.
 */
export const listFiles = async () => {
  try {
    const keys = await redis.keys('*');
    const files = await Promise.all(keys.map(async (key) => {
      const fileData = await redis.get(key);
      return JSON.parse(fileData);
    }));
    return files;
  } catch (error) {
    logError('Error listing files', error);
    throw new Error('Internal Server Error');
  }
};