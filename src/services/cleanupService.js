// @perama: This service handles the cleanup of expired files

import { getExpiredFiles, deleteFile } from '../utils/redisUtil';
import { logInfo, logError } from '../utils/logUtil';
import fs from 'fs/promises';

/**
 * Cleans up expired files by deleting them from the file system and database
 * @returns {Promise<void>}
 */
export const cleanupExpiredFiles = async () => {
  try {
    // * Highlight: Retrieve expired files from the database
    const expiredFiles = await getExpiredFiles();

    for (const file of expiredFiles) {
      try {
        // * Highlight: Delete the file from the file system
        await fs.unlink(file.filePath);

        // * Highlight: Remove the file entry from the database
        await deleteFile(file.id);

        logInfo(`Deleted expired file: ${file.id}`);
      } catch (error) {
        // ! Alert: Failed to delete an expired file
        logError(`Error deleting expired file: ${file.id}`, error);
      }
    }
  } catch (error) {
    // ! Alert: Error occurred during the cleanup process
    logError('Error cleaning up expired files', error);
  }
};

// TODO: Implement a mechanism to retry failed deletions
// TODO: Add a configuration option for cleanup frequency

// @param expiredFiles: Array of file objects that have expired
// @param file.id: Unique identifier for the file
// @param file.filePath: Path to the file in the file system