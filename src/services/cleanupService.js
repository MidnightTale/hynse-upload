// @perama: This service handles the cleanup of expired files

import { getExpiredFiles, deleteFile } from '../utils/redisUtil';
import { logInfo, logError } from '../utils/logUtil';
import fs from 'fs/promises';

export const cleanupExpiredFiles = async () => {
  try {
    const expiredFiles = await getExpiredFiles();
    for (const file of expiredFiles) {
      await fs.unlink(file.filePath);
      await deleteFile(file.id);
      logInfo(`Deleted expired file: ${file.id}`);
    }
  } catch (error) {
    logError('Error cleaning up expired files', error);
  }
};