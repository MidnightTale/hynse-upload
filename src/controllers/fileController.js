// @perama: This file contains the controller functions for handling file uploads and downloads

import { handleFileUpload } from '../services/uploadService';
import { handleFileDownload } from '../services/downloadService';
import { logError, logTrace } from '../utils/logUtil';
export const uploadFile = async (req, res) => {
  try {
    await handleFileUpload(req, res, req.ip);
  } catch (error) {
    logTrace('Error in upload controller', { ip: req.ip }, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    await handleFileDownload(req, res);
  } catch (error) {
    logTrace('Error in download controller', { ip: req.ip }, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};