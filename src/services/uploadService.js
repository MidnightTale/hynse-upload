// @perama: This service handles file uploads using multer and stores file metadata in Redis.

import { Readable } from 'stream';
import { nanoid } from 'nanoid';
import { logInfo, logWarn, logError, logDebug } from '../utils/logUtil';
import { storeFileChunk, finalizeFileUpload } from '../utils/redisUtil';
import config from '../../config';

export const handleFileUpload = async (req, res, ip) => {
  const expiration = parseInt(req.headers['x-expiration']) || 30; // Default to 30 minutes if not provided

  logDebug('File upload initiated', { ip, expiration });

  if (!req.file) {
    logWarn('No file uploaded', { ip });
    return res.status(400).json({ error: 'No file uploaded' });
  }

  logDebug('File received', { 
    filename: req.file.originalname, 
    size: req.file.size, 
    mimetype: req.file.mimetype,
    fieldname: req.file.fieldname
  });

  const fileId = nanoid(10);
  const metadata = {
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    status: 'Uploading',
    progress: 0,
  };

  const uploadExpiration = expiration * 60; // Convert minutes to seconds
  let totalChunks = 0;

  try {
    const stream = Readable.from(req.file.buffer);
    const chunkSize = 1024 * 1024; // 1MB chunks
    let chunk;

    for await (chunk of stream) {
      await storeFileChunk(fileId, totalChunks, chunk, uploadExpiration);
      totalChunks++;
      metadata.progress = Math.min(100, Math.round((totalChunks * chunkSize / req.file.size) * 100));
      logDebug('Chunk uploaded', { fileId, chunkNumber: totalChunks, progress: metadata.progress });
    }

    metadata.status = 'Completed';
    metadata.progress = 100;
    metadata.fileSize = req.file.size;

    await finalizeFileUpload(fileId, metadata, uploadExpiration);

    logInfo(`File upload completed for ID: ${fileId}`);
    const fileUrl = `${req.headers.origin}/d/${fileId}`;
    res.status(200).json({ url: fileUrl, fileId });
  } catch (error) {
    logError('File processing failed', { error: error.message, ip });
    res.status(500).json({ error: 'File processing failed' });
  }
};