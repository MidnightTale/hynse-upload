// This service handles file download requests, retrieves the file from Redis, and sends it to the client.

import { logInfo, logWarn, logError } from '../utils/logUtil';
import { getFile } from './fileService';

/**
 * Handle file download requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const handleFileDownload = async (req, res) => {
  const { id } = req.query;

  try {
    const fileData = await getFile(id);
    if (!fileData) {
      logWarn(`File not found or expired for ID: ${id}`, req);
      return res.status(404).json({ message: 'File not found or expired' });
    }

    const { filePath, originalName } = fileData;
    res.setHeader('Content-Disposition', `attachment; filename=${originalName}`);
    logInfo(`File downloaded with ID: ${id}`, req);
    res.sendFile(filePath, { root: '.' });
  } catch (error) {
    logError(`Error retrieving file with ID: ${id}`, error, req);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};