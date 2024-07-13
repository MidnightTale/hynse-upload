// @perama: This utility provides logging functions with different log levels and formats.

import chalk from 'chalk';
import appConfig from '../../config';
import { isMainThread, threadId as workerThreadId } from 'worker_threads';

const threadId = isMainThread ? 0 : workerThreadId;

/**
 * Get the current time in a localized string format.
 * @returns {string} The current time as a localized string.
 */
const getTime = () => new Date().toLocaleTimeString();

/**
 * Format the log message with time, thread ID, log level, message, and details.
 * @param {string} level - The log level (INFO, WARN, ERROR, DEBUG).
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 * @returns {string} - The formatted log message.
 */
const formatLog = (level, message, details) => {
  // * Highlight: Use chalk to colorize different parts of the log message
  const time = chalk.grey(`[${getTime()}]`);
  const levelColor = level === 'INFO' ? chalk.blue : level === 'ERROR' ? chalk.red : level === 'WARN' ? chalk.yellow : chalk.green;
  const levelText = levelColor(`[${level}]`);
  const threadText = chalk.grey(`[Thread ${threadId}]`);
  const msgText = chalk.white(message);
  const detailsText = details ? chalk.grey(JSON.stringify(details)) : '';

  return `${time} ${threadText} ${levelText} ${msgText} ${detailsText}`;
};

/**
 * Log an info message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logInfo = (message, details) => {
  // * Highlight: Check if the current log level allows INFO messages
  if (['info', 'debug'].includes(appConfig.log.level)) {
    console.info(formatLog('INFO', message, details));
  }
};

/**
 * Log a warning message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logWarn = (message, details) => {
  // * Highlight: Check if the current log level allows WARN messages
  if (['warn', 'debug'].includes(appConfig.log.level)) {
    console.warn(formatLog('WARN', message, details));
  }
};

/**
 * Log an error message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logError = (message, details) => {
  // * Highlight: Check if the current log level allows ERROR messages
  if (['error', 'debug'].includes(appConfig.log.level)) {
    console.error(formatLog('ERROR', message, details));
  }
};

/**
 * Log a debug message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logDebug = (message, details) => {
  // * Highlight: Only log DEBUG messages if the log level is set to debug
  if (appConfig.log.level === 'debug') {
    console.debug(formatLog('DEBUG', message, details));
  }
};

// ! Alert: Ensure that the appConfig.log.level is properly set in the configuration file

// TODO: Implement log rotation to prevent log files from growing too large

// @param level: The log level (INFO, WARN, ERROR, DEBUG)
// @param message: The main log message
// @param details: Optional object containing additional details to be logged