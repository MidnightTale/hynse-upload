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
  setTimeout(async () => {
    try {
      await fs.unlink(filePath);
      await redis.del(fileId);
      logInfo(`File deleted: ${fileId}`);
    } catch (error) {
      logError(`Error deleting file: ${fileId}`, error);
    }
  }, expirationTime * 1000);
};