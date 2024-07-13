// @perama: This service handles file download requests, retrieves the file from Redis, and sends it to the client.

import { logInfo, logWarn, logError } from '../utils/logUtil';
import { getFile } from '../utils/redisUtil';
import path from 'path';
import fs from 'fs';

/**
 * Handle file download requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleFileDownload = async (req, res) => {
  // @param id: Unique identifier for the file to be downloaded
  const { id } = req.query;

  try {
    // * Highlight: Attempt to retrieve file metadata from Redis
    logInfo(`Attempting to retrieve file with ID: ${id}`);
    const fileData = await getFile(id);
    if (!fileData) {
      // ! Alert: File not found or expired
      logWarn(`File not found or expired for ID: ${id}`, req);
      return res.status(404).json({ message: 'File not found or expired' });
    }

    // * Highlight: File metadata successfully retrieved
    logInfo(`File metadata retrieved for ID: ${id}`, { fileData });
    const { filePath, originalName, mimeType } = fileData;

    // ! Alert: Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      logWarn(`File not found on disk for ID: ${id}`, { filePath });
      return res.status(404).json({ message: 'File not found on disk' });
    }

    // * Highlight: Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    logInfo(`Sending file for download, ID: ${id}`, { filePath });
    
    // * Highlight: Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // ! Alert: Handle potential errors during file streaming
    fileStream.on('error', (err) => {
      logError(`Error sending file for ID: ${id}`, { error: err.message });
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error sending file' });
      }
    });
    
    // * Highlight: Log successful file download
    fileStream.on('end', () => {
      logInfo(`File successfully sent for download, ID: ${id}`);
    });
  } catch (error) {
    // ! Alert: Unexpected error during file download process
    logError(`Error retrieving file with ID: ${id}`, { error: error.message, stack: error.stack });
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

// TODO: Implement file cleanup mechanism to remove expired files from disk
// TODO: Add support for partial content requests (HTTP Range headers)
// TODO: Consider implementing rate limiting for file downloads