// This API route handles file download requests by calling the downloadService.
// It retrieves the file metadata from Redis and sends the file to the client.

import { createRouter } from 'next-connect';
import { handleFileDownload } from '../../../services/downloadService';
import { getIp } from '../../../utils/ipUtil';
import { logError, logWarn } from '../../../utils/logUtil';

const router = createRouter();

// Handle GET requests for file download
router.get(handleFileDownload);

export default router.handler({
  onError: (err, req, res) => {
    const ip = getIp(req);
    logError(`Error in API route: ${err.message}`, { err, ip });
    res.status(501).json({ error: `Sorry something happened! ${err.message}` });
  },
  onNoMatch: (req, res) => {
    const ip = getIp(req);
    logWarn(`Method '${req.method}' Not Allowed`, { ip });
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});