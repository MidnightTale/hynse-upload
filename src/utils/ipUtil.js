// This utility provides a function to extract the client's IP address from the request.

import { logDebug } from './logUtil';

/**
 * Extract the client's IP address from the request.
 * @param {Object} req - The request object.
 * @returns {string} - The client's IP address.
 */
export const getIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  let ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // Convert IPv6-mapped IPv4 addresses to IPv4
  if (ip.startsWith('::ffff:')) {
    ip = ip.split(':').pop();
  }
  return ip;
};