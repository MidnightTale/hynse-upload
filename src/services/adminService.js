// This service provides administrative functionalities like listing and clearing files.

import { listFiles } from './fileService';
import redis from '../utils/redisUtil';
import { logInfo, logError } from '../utils/logUtil';

// List all files
export const listFiles = async () => {
  try {
    const files = await listFiles();
    console.log('Files:', files);
  } catch (error) {
    logError('Error listing files', error);
  }
};

// Clear all files
export const clearFiles = async () => {
  try {
    await redis.flushall();
    logInfo('All files cleared');
  } catch (error) {
    logError('Error clearing files', error);
  }
};