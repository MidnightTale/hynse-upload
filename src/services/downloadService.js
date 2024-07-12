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
  const { id } = req.query;

  try {
    logInfo(`Attempting to retrieve file with ID: ${id}`);
    const fileData = await getFile(id);
    if (!fileData) {
      logWarn(`File not found or expired for ID: ${id}`, req);
      return res.status(404).json({ message: 'File not found or expired' });
    }

    logInfo(`File metadata retrieved for ID: ${id}`, { fileData });
    const { filePath, originalName, mimeType } = fileData;

    if (!fs.existsSync(filePath)) {
      logWarn(`File not found on disk for ID: ${id}`, { filePath });
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    logInfo(`Sending file for download, ID: ${id}`, { filePath });
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      logError(`Error sending file for ID: ${id}`, { error: err.message });
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error sending file' });
      }
    });
    
    fileStream.on('end', () => {
      logInfo(`File successfully sent for download, ID: ${id}`);
    });
  } catch (error) {
    logError(`Error retrieving file with ID: ${id}`, { error: error.message, stack: error.stack });
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};