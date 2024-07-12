// @perama: This file contains the custom routes for file upload and download operations.
// It handles file uploads, downloads, and listing, bypassing Next.js API routes.

import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { logInfo, logError, logWarn, logDebug } from '../utils/logUtil';
import { storeFileMetadata, getFile } from '../utils/redisUtil';
import { scheduleFileDeletion } from '../utils/cleanupUtil';
import config from '../../config';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const fileId = nanoid(10);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${fileId}${fileExtension}`);
  },
});

const upload = multer({ storage });

/**
 * Handle file upload
 * @perama: This route handles file uploads, stores metadata in Redis, and schedules file deletion
 */
router.post('/upload', upload.array('files'), async (req, res) => {
  const files = req.files;
  const expiration = parseInt(req.body.expiration) || 30; // Default to 30 minutes

  if (!files || files.length === 0) {
    logWarn('No files uploaded', { ip: req.ip });
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const fileUploadPromises = files.map(async (file) => {
      const fileId = path.parse(file.filename).name;
      const fileData = {
        filePath: file.path,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'Completed',
        progress: 100,
      };

      const uploadExpiration = expiration * 60; // Convert minutes to seconds
      await storeFileMetadata(fileId, fileData, uploadExpiration);
      await scheduleFileDeletion(fileId, file.path, uploadExpiration);

      logInfo(`File upload completed for ID: ${fileId}`);
      return { fileId, success: true };
    });

    const results = await Promise.all(fileUploadPromises);
    const fileUrls = results.map(result => `${req.protocol}://${req.get('host')}/d/${result.fileId}`);
    logInfo('Files uploaded successfully', { ip: req.ip, fileUrls });

    res.status(200).json({ urls: fileUrls, fileIds: results.map(result => result.fileId) });
  } catch (error) {
    logError('File processing failed', { error: error.message, ip: req.ip });
    res.status(500).json({ error: 'File processing failed' });
  }
});

/**
 * Handle file download
 * @perama: This route retrieves file metadata from Redis and sends the file to the client
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const fileData = await getFile(id);
    if (!fileData) {
      logWarn(`File not found or expired for ID: ${id}`);
      return res.status(404).json({ message: 'File not found or expired' });
    }

    const { filePath, originalName, mimeType } = fileData;

    if (!fs.existsSync(filePath)) {
      logWarn(`File not found on disk for ID: ${id}`, { filePath });
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    
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
    logError(`Error retrieving file with ID: ${id}`, { error: error.message });
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

export default router;