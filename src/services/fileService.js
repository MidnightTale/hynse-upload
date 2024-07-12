// This service handles file uploads and retrievals using Redis for temporary storage.
// It uses multithreading for file processing to enhance performance.

import { nanoid } from 'nanoid';
import redis from '../utils/redisUtil';
import appConfig from '../../config';
import { logInfo, logError, logWarn, logDebug } from '../utils/logUtil';

/**
 * Retrieve a file's metadata from Redis.
 * @param {string} id - The ID of the file.
 * @returns {Object|null} - The file metadata or null if not found.
 */
export const getFile = async (id) => {
  try {
    const result = await masterService.distributeTask({ type: 'getFile', data: { id } });
    return result;
  } catch (error) {
    logError(`Error retrieving file metadata with ID: ${id}`, error);
    throw new Error('Internal Server Error');
  }
};

/**
 * List all files stored in Redis.
 * @returns {Array} - An array of file metadata.
 */
export const listFiles = async () => {
  try {
    const result = await masterService.distributeTask({ type: 'listFiles' });
    return result;
  } catch (error) {
    logError('Error listing files', error);
    throw new Error('Internal Server Error');
  }
};

/**
 * Sort files by a given attribute.
 * @param {Array} files - The array of file metadata.
 * @param {string} attribute - The attribute to sort by.
 * @returns {Array} - The sorted array of file metadata.
 */
export const sortFiles = (files, attribute) => {
  return files.sort((a, b) => (a[attribute] > b[attribute] ? 1 : -1));
};