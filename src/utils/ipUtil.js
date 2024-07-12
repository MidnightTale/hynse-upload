// This utility provides a function to extract the client's IP address from the request.

import { logDebug } from './logUtil';

/**
 * Get the client's IP address from the request object.
 * @param {Object} req - The request object.
 * @returns {string} - The client's IP address.
 */
export const getIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'Unknown';
};