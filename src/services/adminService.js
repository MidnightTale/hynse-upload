// @perama: This service provides administrative functionalities like listing and clearing files.
// It uses the Better Comments VSCode extension for improved readability.

import { listFiles2 } from './fileService';
import redis from '../utils/redisUtil';
import { logInfo, logError } from '../utils/logUtil';

/**
 * List all files in the system
 * @returns {Promise<void>}
 */
export const listFiles2 = async () => {
  try {
    // * Highlight: Retrieve all files from the file service
    const files = await listFiles();
    console.log('Files:', files);
    
    // TODO: Implement pagination for large file lists
    // TODO: Add filtering options for file listing
  } catch (error) {
    // ! Alert: Error occurred while listing files
    logError('Error listing files', error);
    throw error; // Re-throw to allow caller to handle
  }
};

/**
 * Clear all files from the system
 * @returns {Promise<void>}
 */
export const clearFiles = async () => {
  try {
    // * Highlight: Use Redis to flush all data
    await redis.flushall();
    logInfo('All files cleared');
    
    // TODO: Implement selective file clearing
    // TODO: Add confirmation step before clearing all files
  } catch (error) {
    // ! Alert: Error occurred while clearing files
    logError('Error clearing files', error);
    throw error; // Re-throw to allow caller to handle
  }
};

// @param files: Array of file objects returned from fileService
// @param error: Error object if an exception occurs