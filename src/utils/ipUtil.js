// @perama: This utility provides a function to extract the client's IP address from the request.

import { logDebug } from './logUtil';

/**
 * Get the client's IP address from the request object.
 * @param {Object} req - The request object.
 * @returns {string} - The client's IP address.
 */
export const getIp = (req) => {
  // * Highlight: Check for X-Forwarded-For header first
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // * Highlight: X-Forwarded-For may contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  // ! Alert: Fallback to socket address if X-Forwarded-For is not available
  return req.socket.remoteAddress || 'Unknown';
};

// TODO: Implement IP validation function
// TODO: Add support for IPv6 addresses

// @param req: The request object containing headers and socket information