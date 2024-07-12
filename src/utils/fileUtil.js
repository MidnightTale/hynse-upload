// This utility provides functions to handle file-related operations.

import fs from 'fs';
import path from 'path';

/**
 * Ensure the uploads directory exists.
 * @param {string} dir - The directory path.
 */
export const ensureUploadsDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Get the file extension from the filename.
 * @param {string} filename - The filename.
 * @returns {string} - The file extension.
 */
export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};