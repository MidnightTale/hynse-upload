// @perama: This utility provides logging functions for client-side use.
// It mimics the server-side logUtil but is adapted for browser environments.

import { toast } from 'react-toastify';
import config from '../../../config';
/**
 * Format a log message with timestamp and details.
 * @param {string} level - The log level (e.g., 'INFO', 'WARN', 'ERROR').
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 * @returns {string} Formatted log message.
 */
const formatLog = (level, message, details) => {
  const time = new Date().toLocaleTimeString();
  const detailsText = details ? JSON.stringify(details) : '';
  return `${time} [${level}] ${message} ${detailsText}`;
};

/**
 * Log an info message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logInfo = (message, details) => {
  if (['info', 'debug'].includes(config.log.level)) {
    console.info(formatLog('INFO', message, details));
  }
};

/**
 * Log a warning message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logWarn = (message, details) => {
  if (['warn', 'debug'].includes(config.log.level)) {
    console.warn(formatLog('WARN', message, details));
  }
};

/**
 * Log an error message and display a toast notification.
 * @param {string} message - The error message.
 * @param {Object} [details] - Additional error details.
 * @param {number} [statusCode] - HTTP status code of the error.
 */
export const logError = (message, details, statusCode) => {
  console.error(formatLog('ERROR', message, details));
  
  if (config.log.showErrorToasts) {
    
    toast.error(
      <div className="flex items-center">
        <div>
          <p>{message}</p>
          <p className="text-sm opacity-70">Check console for more details (Ctrl+Shift+J)</p>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-toast-background text-toast-text',
      }
    );
  }
};

/**
 * Log a debug message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 */
export const logDebug = (message, details) => {
  if (config.log.level === 'debug') {
    console.debug(formatLog('DEBUG', message, details));
  }
};