// @perama: This service handles file download requests, retrieves the file from Redis, and sends it to the client.

import { logInfo, logWarn, logError } from '../utils/logUtil';
import { getFile } from '../utils/redisUtil';

/**
 * Handle file download requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleFileDownload = async (req, res) => {
  const { id } = req.params;

  try {
    logInfo(`Attempting to retrieve file with ID: ${id}`);
    const fileData = await getFile(id);
    if (!fileData) {
      logWarn(`File not found or expired for ID: ${id}`);
      return res.status(404).json({ message: 'File not found or expired' });
    }

    logInfo(`File data retrieved for ID: ${id}`);
    const { fileData: buffer, metadata } = fileData;
    const { originalName, mimeType } = metadata;

    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.length);
    
    logInfo(`Sending file for download, ID: ${id}`);
    res.send(buffer);
    
    logInfo(`File successfully sent for download, ID: ${id}`);
  } catch (error) {
    logError(`Error retrieving file with ID: ${id}`, { error: error.message });
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};