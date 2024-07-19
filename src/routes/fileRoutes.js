// @perama: This file contains the custom routes for file upload and download operations.
// It handles file uploads, downloads, and listing, bypassing Next.js API routes.

import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { logInfo, logError, logWarn, logDebug, logTrace } from '../utils/logUtil';
import { storeFileMetadata, getFile, storeSessionKey, getSessionKey, validateSessionKey, updateHeartbeat } from '../utils/redisUtil';
import { scheduleFileDeletion } from '../utils/cleanupUtil';
import config from '../../config';
import { getIp } from '../utils/ipUtil';
import chalk from 'chalk';
import crypto from 'crypto';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  // Check both extension and MIME type
  if (config.multer.forbiddenExtensions.includes(ext) || 
      config.multer.forbiddenPrefixes.some(prefix => ext.startsWith(prefix)) ||
      config.multer.forbiddenMimeTypes.includes(mimeType)) {
    return cb(new Error('File type not allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage,
  limits: config.multer.limits,
  fileFilter
});

/**
 * Handle file upload
 * @perama: This route handles file uploads, stores metadata in Redis, and schedules file deletion
 */
router.post('/upload', upload.array('files'), async (req, res) => {
  const ip = getIp(req);
  const { sessionId, sessionKey, sessionSalt } = req.body;

  logInfo('Upload request received', { ip, hasSessionData: !!sessionId && !!sessionKey && !!sessionSalt });

  if (!sessionId || !sessionKey || !sessionSalt || !(await validateSessionKey(ip, sessionId, sessionKey, sessionSalt))) {
    logWarn('Invalid session data', { ip });
    return res.status(401).json({ error: 'Invalid session data' });
  }

  logInfo('Session data validated successfully', { ip, sessionId });

  const files = req.files;
  const expiration = parseInt(req.body.expiration) || 30; // Default to 30 minutes

  if (config.log.logUploads) {
    logDebug(`File upload initiated - IP: ${chalk.bold(ip)}, Files: ${files.map(file => 
      `${chalk.bold(file.originalname)} (${chalk.yellow(formatFileSize(file.size))}, ${chalk.magenta(file.mimetype)})`
    ).join(', ')}, Expiration: ${chalk.green(`${expiration} minutes`)}`);
  }

  if (!files || files.length === 0) {
    logWarn('No files uploaded', { ip });
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
        uploadedBy: ip, // Store the IP address with the file metadata
        uploadDate: new Date().toISOString(),
        expiration: expiration 
      };

      const uploadExpiration = expiration * 60; // Convert minutes to seconds
      await storeFileMetadata(fileId, fileData, uploadExpiration);
      await scheduleFileDeletion(fileId, file.path, uploadExpiration);

      if (config.log.logUploads) {
        logDebug(`File upload completed - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(fileId)}, ` +
          `FileName: ${chalk.bold(file.originalname)}, FileSize: ${chalk.yellow(formatFileSize(file.size))}, ` +
          `FileType: ${chalk.magenta(file.mimetype)}, ExpirationTime: ${chalk.green(`${expiration} minutes`)}, ` +
          `ExpirationDate: ${chalk.blue(new Date(Date.now() + uploadExpiration * 1000).toISOString())}`);
      }
      return { fileId, success: true };
    });

    if (config.errorSimulation.enabled && config.errorSimulation.uploadError) {
      if (Math.random() < config.errorSimulation.probability) {
        throw new Error('Simulated upload error for testing');
      }
    }

    const results = await Promise.all(fileUploadPromises);
    const downloadDomain = config.download.usePublicDomain 
      ? `https://${config.download.publicDomain}` 
      : `http://${config.download.hostname}:${config.download.port}`;
    const fileUrls = results.map(result => `${downloadDomain}/${result.fileId}`);
    if (config.log.logUploads) {
      logInfo(`Files uploaded successfully - IP: ${chalk.bold(ip)}, FileURLs: ${chalk.cyan(fileUrls.join(', '))}, ` +
        `Files: ${results.map((result, index) => 
          `${chalk.cyan(result.fileId)} (${chalk.bold(files[index].originalname)}, ` +
          `${chalk.yellow(formatFileSize(files[index].size))}, ${chalk.magenta(files[index].mimetype)})`
        ).join(', ')}, ExpirationTime: ${chalk.green(`${expiration} minutes`)}, ` +
        `ExpirationDate: ${chalk.blue(new Date(Date.now() + expiration * 60 * 1000).toISOString())}`);
    }

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
});

/**
 * Handle file download
 * @perama: This route retrieves file metadata from Redis and sends the file to the client
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const ip = getIp(req);

  try {
    if (config.log.logDownloads) {
      logDebug(`File download initiated - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}`);
    }
    const fileData = await getFile(id);
    if (!fileData) {
      if (config.log.logDownloads) {
        logDebug(`File not found or expired - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}`);
      }
      return res.status(404).json({ message: 'File not found or expired' });
    }

    if (config.errorSimulation.enabled && config.errorSimulation.downloadError) {
      if (Math.random() < config.errorSimulation.probability) {
        throw new Error('Simulated download error for testing');
      }
    }

    if (config.log.logDownloads) {
      logDebug(`File metadata retrieved - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}, ` +
        `FileName: ${chalk.bold(fileData.originalName)}, FileSize: ${chalk.yellow(formatFileSize(fileData.fileSize))}, ` +
        `FileType: ${chalk.magenta(fileData.mimeType)}, UploadedBy: ${chalk.bold(fileData.uploadedBy)}`);
    }

    const { filePath, originalName, mimeType } = fileData;

    if (!fs.existsSync(filePath)) {
      logError(`File not found on disk - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}, FilePath: ${filePath}`);
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', mimeType);
    if (config.log.logDownloads) {
      logInfo(`Sending file for download - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}, ` +
        `FileName: ${chalk.bold(originalName)}, FileSize: ${chalk.yellow(formatFileSize(fileData.fileSize))}, ` +
        `FileType: ${chalk.magenta(mimeType)}, UploadedBy: ${chalk.bold(fileData.uploadedBy)}`);
    }
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      logError(`Error sending file - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}, Error: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error sending file' });
      }
    });
    
    fileStream.on('end', () => {
      if (config.log.logDownloads) {
        logDebug(`File download completed - IP: ${chalk.bold(ip)}, FileID: ${chalk.cyan(id)}, ` +
          `FileName: ${chalk.bold(originalName)}, FileSize: ${chalk.yellow(formatFileSize(fileData.fileSize))}, ` +
          `FileType: ${chalk.magenta(mimeType)}, UploadedBy: ${chalk.bold(fileData.uploadedBy)}`);
      }
    });
  } catch (error) {
    logTrace(`Error retrieving file`, {
      ip,
      fileId: id,
    }, error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

router.post('/request-session-key', async (req, res) => {
  const ip = getIp(req);
  const { sessionId } = req.body;
  const key = nanoid(32);
  const salt = crypto.randomBytes(16).toString('hex');
  const encryptedKey = crypto.scryptSync(key, salt, 32).toString('hex');

  try {
    await storeSessionKey(ip, sessionId, encryptedKey, salt);
    logInfo('Session key requested and stored', { ip, sessionId, keyLength: key.length, saltLength: salt.length });
    res.json({ key, salt });
  } catch (error) {
    logError('Error storing session key', { ip, sessionId }, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/heartbeat', async (req, res) => {
  const ip = getIp(req);
  const { sessionId, sessionKey, sessionSalt } = req.body;

  if (!sessionId || !sessionKey || !sessionSalt) {
    logWarn('Invalid heartbeat data', { ip });
    return res.status(400).json({ error: 'Invalid heartbeat data' });
  }

  const isValid = await validateSessionKey(ip, sessionId, sessionKey, sessionSalt, true);
  if (!isValid) {
    logWarn('Invalid session data for heartbeat', { ip, sessionId });
    return res.status(401).json({ error: 'Invalid session data' });
  }

  const updated = await updateHeartbeat(ip, sessionId);
  if (updated) {
    logInfo('Heartbeat received and processed', { ip, sessionId });
    res.json({ message: 'Heartbeat received' });
  } else {
    logWarn('Session not found for heartbeat', { ip, sessionId });
    res.status(404).json({ error: 'Session not found' });
  }
});

export default router;