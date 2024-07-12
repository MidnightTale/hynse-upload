// This service handles file uploads using multer and stores file metadata in Redis.

import multer from 'multer';
import { logInfo, logWarn, logError, logDebug } from '../utils/logUtil';
import appConfig from '../../config';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import { storeFileMetadata } from '../utils/redisUtil'; // Import storeFileMetadata

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadMiddleware = multer({ storage }).array('files');

/**
 * Handle file upload requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} ip - The IP address of the client.
 */
export const handleFileUpload = async (req, res, ip) => {
  const files = req.files;

  logDebug('File upload initiated', { ip, files: files.map(file => file.originalname) });

  if (!files || files.length === 0) {
    logWarn('No files uploaded', { ip });
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const fileUploadPromises = files.map(async (file) => {
      const fileId = nanoid(10);
      const fileData = {
        filePath: file.path,
        originalName: file.originalname,
      };

      const uploadExpiration = parseInt(appConfig.upload.expiration, 10);
      if (isNaN(uploadExpiration)) {
        throw new Error('Upload expiration value is not a valid integer');
      }
      logDebug('Storing file metadata', { fileId, fileData, uploadExpiration });

      await storeFileMetadata(fileId, fileData, uploadExpiration);

      logInfo(`File metadata stored with ID: ${fileId}`);
      return { fileId, success: true };
    });

    const results = await Promise.all(fileUploadPromises);
    const fileUrls = results.map(result => `${req.headers.origin}/api/download/${result.fileId}`);
    logInfo('Files uploaded successfully', { ip, fileUrls });

    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    logError('File processing failed', { error: error.message, ip });
    res.status(500).json({ error: 'File processing failed' });
  } finally {
    if (!res.headersSent) {
      res.status(200).json({ message: 'File upload completed' });
    }
  }
};