// @perama: This utility handles file cleanup operations

import fs from 'fs/promises';
import path from 'path';
import { logInfo, logError } from './logUtil';
import redis from './redisUtil';
import config from '../../config';

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
  }, expirationTime * 1000 + config.cleanup.deletionDelay);
};

/**
 * Run the cleanup process to delete expired files
 */
export const runCleanup = async () => {
  try {
    const expiredFiles = await getExpiredFiles(config.cleanup.batchSize);
    for (const file of expiredFiles) {
      await scheduleFileDeletion(file.id, file.filePath, 0);
    }
    logInfo(`Cleanup process completed. Processed ${expiredFiles.length} files.`);
  } catch (error) {
    logError('Error during cleanup process', error);
  }
};

/**
 * Start the cleanup scheduler
 */
export const startCleanupScheduler = () => {
  setInterval(runCleanup, config.cleanup.schedulerInterval);
  logInfo('Cleanup scheduler started');
};