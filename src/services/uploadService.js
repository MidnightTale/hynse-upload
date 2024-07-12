// @perama: This service handles file uploads using multer and stores file metadata in Redis.

import multer from 'multer';
import { logInfo, logWarn, logError, logDebug } from '../utils/logUtil';
import appConfig from '../../config';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import { storeFileMetadata } from '../utils/redisUtil'; // Import storeFileMetadata
import { scheduleFileDeletion } from '../utils/cleanupUtil';

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
  const expiration = parseInt(req.body.expiration) || 30; // Default to 30 minutes if not provided

  logDebug('File upload initiated', { ip, files: files.map(file => file.originalname), expiration });

  if (!files || files.length === 0) {
    logWarn('No files uploaded', { ip });
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const fileUploadPromises = files.map(async (file) => {
      const fileId = nanoid(10);
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fileId}${fileExtension}`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);

      const fileData = {
        filePath,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'Completed',
        progress: 100,
      };

      const uploadExpiration = expiration * 60; // Convert minutes to seconds
      logDebug('Storing file metadata', { fileId, fileData, uploadExpiration });

      await storeFileMetadata(fileId, fileData, uploadExpiration);
      await scheduleFileDeletion(fileId, filePath, uploadExpiration);

      logInfo(`File upload completed for ID: ${fileId}`);
      return { fileId, success: true };
    });

    const results = await Promise.all(fileUploadPromises);
    const fileUrls = results.map(result => `${req.headers.origin}/d/${result.fileId}`);
    logInfo('Files uploaded successfully', { ip, fileUrls });

    res.status(200).json({ urls: fileUrls, fileIds: results.map(result => result.fileId) });
  } catch (error) {
    logError('File processing failed', { error: error.message, ip });
    res.status(500).json({ error: 'File processing failed' });
  }
};