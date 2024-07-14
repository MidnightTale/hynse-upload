// @perama: This service handles file uploads using multer and stores file metadata in Redis.

import multer from 'multer';
import { logInfo, logWarn, logError, logDebug, logTrace } from '../utils/logUtil';
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
  const expiration = parseInt(req.body.expiration) || 30;

  logInfo('File upload initiated', { 
    ip, 
    files: files.map(file => ({
      name: file.originalname,
      size: formatFileSize(file.size),
      type: file.mimetype
    })), 
    expiration 
  });

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

      logInfo(`File upload completed`, {
        ip,
        fileId,
        fileName: file.originalname,
        fileSize: formatFileSize(file.size),
        fileType: file.mimetype,
        expirationTime: `${expiration} minutes`,
        expirationDate: new Date(Date.now() + uploadExpiration * 1000).toISOString()
      });
      return { fileId, success: true };
    });

    const results = await Promise.all(fileUploadPromises);
    const downloadDomain = appConfig.download.usePublicDomain 
      ? `https://${appConfig.download.publicDomain}` 
      : `http://${appConfig.download.hostname}:${appConfig.download.port}`;
    const fileUrls = results.map(result => `${downloadDomain}/${result.fileId}`);
    logInfo('Files uploaded successfully', { 
      ip, 
      fileUrls,
      files: results.map((result, index) => ({
        fileId: result.fileId,
        fileName: files[index].originalname,
        fileSize: formatFileSize(files[index].size),
        fileType: files[index].mimetype,
        expirationTime: `${expiration} minutes`,
        expirationDate: new Date(Date.now() + expiration * 60 * 1000).toISOString()
      }))
    });

    res.status(200).json({ urls: fileUrls, fileIds: results.map(result => result.fileId) });
  } catch (error) {
    logTrace('File processing failed', { 
      ip,
      files: files.map(file => ({
        name: file.originalname,
        size: formatFileSize(file.size),
        type: file.mimetype
      }))
    }, error);
    res.status(500).json({ error: 'File processing failed' });
  }
};

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}