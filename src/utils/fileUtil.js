// @perama: This utility provides functions to handle file-related operations.

import fs from 'fs';
import path from 'path';

/**
 * Ensure the uploads directory exists.
 * @param {string} dir - The directory path.
 */
export const ensureUploadsDir = (dir) => {
  // ! Alert: Check if directory exists before creating
  if (!fs.existsSync(dir)) {
    // * Highlight: Create directory recursively
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Get the file extension from the filename.
 * @param {string} filename - The filename.
 * @returns {string} - The file extension.
 */
export const getFileExtension = (filename) => {
  // * Highlight: Extract and return lowercase extension
  return path.extname(filename).toLowerCase();
};

// TODO: Implement file size validation function
// TODO: Add function to generate unique filenames

// @param dir: The directory path to check/create
// @param filename: The filename to extract extension from