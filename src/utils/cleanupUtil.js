// @perama: This utility handles file cleanup operations

import fs from 'fs/promises';
import path from 'path';
import { logInfo, logError } from './logUtil';
import redis from './redisUtil';

/**
 * Schedule file deletion after expiration
 * @param {string} fileId - The ID of the file
 * @param {string} filePath - The path of the file
 * @param {number} expirationTime - The expiration time in seconds
 */
export const scheduleFileDeletion = async (fileId, filePath, expirationTime) => {
  // * Highlight: Use setTimeout to schedule deletion after expiration time
  setTimeout(async () => {
    try {
      // * Highlight: Attempt to delete the file from the filesystem
      await fs.unlink(filePath);
      
      // * Highlight: Remove the file entry from Redis
      await redis.del(fileId);
      
      logInfo(`File deleted: ${fileId}`);
    } catch (error) {
      // ! Alert: Failed to delete file or remove Redis entry
      logError(`Error deleting file: ${fileId}`, error);
    }
  }, expirationTime * 1000); // Convert seconds to milliseconds
};

// TODO: Implement a cleanup function to handle orphaned files
// TODO: Add error handling for cases where the file doesn't exist at deletion time

// @param fileId: Unique identifier for the file in Redis
// @param filePath: Full path to the file on the filesystem
// @param expirationTime: Time in seconds after which the file should be deleted