// This utility provides logging functions with different log levels and formats.

import chalk from 'chalk';
import appConfig from '../../config';
import { isMainThread, threadId as workerThreadId } from 'worker_threads';

const threadId = isMainThread ? 0 : workerThreadId;

const getTime = () => new Date().toLocaleTimeString();

/**
 * Format the log message with time, thread ID, log level, message, and details.
 * @param {string} level - The log level (INFO, WARN, ERROR, DEBUG).
 * @param {string} message - The log message.
 * @returns {string} - The formatted log message.
 */
const formatLog = (level, message) => {
  const time = chalk.grey(`${getTime()}`);
  const levelColor = level === 'INFO' ? chalk.blue : level === 'ERROR' ? chalk.red : level === 'WARN' ? chalk.yellow : chalk.green;
  const levelText = levelColor(`[${level}]`);
  const threadText = chalk.grey(`[Thread ${threadId}]`);

  return `${time} ${threadText} ${levelText} ${message}`;
};

/**
 * Log an info message.
 * @param {string} message - The log message.
 */
export const logInfo = (message) => {
  if (['info', 'debug'].includes(appConfig.log.level)) {
    console.info(formatLog('INFO', message));
  }
};

/**
 * Log a warning message.
 * @param {string} message - The log message.
 */
export const logWarn = (message) => {
  if (['warn', 'debug'].includes(appConfig.log.level)) {
    console.warn(formatLog('WARN', message));
  }
};

/**
 * Log an error message.
 * @param {string} message - The log message.
 */
export const logError = (message, details) => {
  if (['error', 'debug'].includes(appConfig.log.level)) {
    console.error(formatLog('ERROR', message));
  }
};

/**
 * Log a debug message.
 * @param {string} message - The log message.
 */
export const logDebug = (message) => {
  if (appConfig.log.level === 'debug') {
    console.debug(formatLog('DEBUG', message));
  }
};