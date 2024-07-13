// @perama: This file contains the custom routes for file upload and download operations.
// It handles file uploads, downloads, and listing, bypassing Next.js API routes.

import express from 'express';
import multer from 'multer';
import { handleFileUpload } from '../services/uploadService';
import { handleFileDownload } from '../services/downloadService';
import { logInfo, logError } from '../utils/logUtil';
import config from '../../config';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: config.multer.limits.fileSize },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
}).single('file');

/**
 * Handle file upload
 * @perama: This route handles file uploads, stores metadata in Redis, and schedules file deletion
 */
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      logError('Multer error', err);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      logError('Unknown error', err);
      return res.status(500).json({ error: 'Unknown error occurred during file upload' });
    }

    try {
      await handleFileUpload(req, res, req.ip);
    } catch (error) {
      logError('Error in upload route', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

/**
 * Handle file download
 * @perama: This route retrieves file metadata from Redis and sends the file to the client
 */
router.get('/d/:id', async (req, res) => {
  try {
    await handleFileDownload(req, res);
  } catch (error) {
    logError('Error in download route', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;