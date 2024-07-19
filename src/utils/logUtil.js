// This utility provides logging functions with different log levels and formats.

import chalk from 'chalk';
import config from './../../config';
import { isMainThread, threadId as workerThreadId } from 'worker_threads';

const threadId = isMainThread ? 0 : workerThreadId;

const getTime = () => new Date().toLocaleTimeString();

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

const sanitizeDetails = (details) => {
  if (!config.log.sanitize) return details;

  const sanitized = { ...details };
  if (sanitized.ip) {
    sanitized.ip = sanitized.ip.replace(/\d+\.\d+$/, 'xxx.xxx');
  }
  if (sanitized.userAgent) {
    sanitized.userAgent = 'REDACTED';
  }
  return sanitized;
};

const formatLog = (level, message, details, error) => {
  const time = chalk.grey(`${getTime()}`);
  const levelColor = level === 'INFO' ? chalk.blue : level === 'ERROR' ? chalk.red : level === 'WARN' ? chalk.yellow : level === 'DEBUG' ? chalk.green : chalk.magenta;
  const levelText = levelColor(`[${level}]`);
  const threadText = chalk.grey(`[Thread ${threadId}]`);
  const detailsText = details ? ` ${JSON.stringify(sanitizeDetails(details))}` : '';
  let errorText = '';

  if (error && appConfig.log.traceErrors && level === 'ERROR') {
    errorText = `\n${chalk.red(error.stack)}`;
  }

  return `${time} ${threadText} ${levelText} ${message}${detailsText}${errorText}`;
};

const log = (level, message, details, error) => {
  if (logLevels[config.log.level.toLowerCase()] >= logLevels[level.toLowerCase()]) {
    console[level.toLowerCase()](formatLog(level.toUpperCase(), message, details, error));
  }
};

export const logError = (message, details, error) => log('error', message, details, error);
export const logWarn = (message, details) => log('warn', message, details);
export const logInfo = (message, details) => log('info', message, details);
export const logDebug = (message, details) => log('debug', message, details);
export const logTrace = (message, details, error) => log('trace', message, details, error);