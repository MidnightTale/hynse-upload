// @perama: This file contains the controller functions for handling file uploads and downloads

import { handleFileUpload } from '../services/uploadService';
import { handleFileDownload } from '../services/downloadService';
import { logError } from '../utils/logUtil';

export const uploadFile = async (req, res) => {
  try {
    await handleFileUpload(req, res);
  } catch (error) {
    logError('Error in upload controller', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    await handleFileDownload(req, res);
  } catch (error) {
    logError('Error in download controller', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};