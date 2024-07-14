// @perama: This utility provides functions to log incoming requests

import { logDebug } from './logUtil';
import chalk from 'chalk';
import config from '../../config';

let nextRequestCount = 0;
let lastNextRequestTime = 0;

const symbols = {
  normal: '→',
  next: '⚡',
};

/**
 * Log incoming requests
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
export const logRequest = (req, res, next) => {
  if (!config.log.logRequests) {
    next();
    return;
  }

  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers['user-agent'];

  if (url.startsWith('/_next/')) {
    const currentTime = Date.now();
    if (currentTime - lastNextRequestTime > 5000) {
      // If more than 5 seconds have passed, log the accumulated _next requests
      logDebug(`${chalk.yellow(symbols.next)} Incoming _next requests: ${chalk.cyan(nextRequestCount)}`, { ip, userAgent });
      nextRequestCount = 1;
    } else {
      nextRequestCount++;
    }
    lastNextRequestTime = currentTime;
  } else {
    logDebug(`${chalk.green(symbols.normal)} Incoming request: ${chalk.blue(method)} ${chalk.magenta(url)}`, { ip, userAgent });
  }

  next();
};

// Log any remaining _next requests when the server is shutting down
process.on('SIGINT', () => {
  if (nextRequestCount > 0 && config.log.logRequests) {
    logDebug(`${chalk.yellow(symbols.next)} Incoming _next requests: ${chalk.cyan(nextRequestCount)}`, { ip: 'N/A', userAgent: 'N/A' });
  }
  process.exit();
});