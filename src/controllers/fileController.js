// @perama: This file contains the controller functions for handling file uploads and downloads

import { handleFileUpload } from '../services/uploadService';
import { handleFileDownload } from '../services/downloadService';
import { logError } from '../utils/logUtil';

/**
 * Controller function to handle file uploads
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const uploadFile = async (req, res) => {
  try {
    // * Highlight: Delegate file upload handling to the uploadService
    await handleFileUpload(req, res);
  } catch (error) {
    // ! Alert: Error occurred during file upload
    logError('Error in upload controller', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Controller function to handle file downloads
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const downloadFile = async (req, res) => {
  try {
    // * Highlight: Delegate file download handling to the downloadService
    await handleFileDownload(req, res);
  } catch (error) {
    // ! Alert: Error occurred during file download
    logError('Error in download controller', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// TODO: Implement file deletion functionality
// TODO: Add input validation for file uploads and downloads
// TODO: Implement rate limiting for file operations to prevent abuse

// @param req: The Express request object containing file information and user data
// @param res: The Express response object used to send the result back to the client