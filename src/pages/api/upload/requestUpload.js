// This file handles file upload requests using Next.js API routes.
// It processes the upload using multer middleware.

import { createRouter } from 'next-connect';
import { handleFileUpload, uploadMiddleware } from '../../../services/uploadService';
import { logError, logWarn, logInfo, logDebug } from '../../../utils/logUtil';
import { getIp } from '../../../utils/ipUtil';

const router = createRouter();

router.use((req, res, next) => {
  req.ip = getIp(req); // Set the request.ip property
  next();
});

// Apply middleware for file upload
router.use(uploadMiddleware);

/**
 * Handle POST requests for file upload.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post(async (req, res) => {
  const ip = req.ip;

  logDebug('File upload request received', { ip });

  try {
    await handleFileUpload(req, res, ip);
  } catch (error) {
    logError('Error processing upload request', { error: error.message, ip });
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Export the router with error handling
export default router.handler({
  onError: (err, req, res) => {
    const ip = req.ip;
    logError(`Error in API route: ${err.message}`, { err, ip });
    res.status(501).json({ error: `Sorry something happened! ${err.message}` });
  },
  onNoMatch: (req, res) => {
    const ip = req.ip;
    logWarn(`Method '${req.method}' Not Allowed`, { ip });
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};