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
  const ip = req.ip;

  try {
    logInfo(`File download initiated`, { ip, fileId: id });
    const fileData = await getFile(id);
    if (!fileData) {
      logWarn(`File not found or expired`, { ip, fileId: id });
      return res.status(404).json({ message: 'File not found or expired' });
    }

    logInfo(`File metadata retrieved`, { 
      ip, 
      fileId: id, 
      fileName: fileData.originalName, 
      fileSize: formatFileSize(fileData.fileSize),
      fileType: fileData.mimeType
    });

    const { filePath, originalName, mimeType } = fileData;

    if (!fs.existsSync(filePath)) {
      logWarn(`File not found on disk`, { ip, fileId: id, filePath });
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    logInfo(`Sending file for download`, { 
      ip, 
      fileId: id, 
      fileName: originalName, 
      fileSize: formatFileSize(fileData.fileSize),
      fileType: mimeType
    });
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      logError(`Error sending file`, { ip, fileId: id, error: err.message });
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error sending file' });
      }
    });
    
    fileStream.on('end', () => {
      logInfo(`File download completed`, { 
        ip, 
        fileId: id, 
        fileName: originalName, 
        fileSize: formatFileSize(fileData.fileSize),
        fileType: mimeType
      });
    });
  } catch (error) {
    logError(`Error retrieving file`, { 
      ip, 
      fileId: id, 
      error: error.message, 
      stack: error.stack 
    });
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}