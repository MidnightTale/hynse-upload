// @perama: This utility provides logging functions for client-side use.
// It mimics the server-side logUtil but is adapted for browser environments.
// * Highlight: This module integrates with react-toastify for error notifications

import { toast } from 'react-toastify';
import config from '../../config';

// * Highlight: Custom error icons for different HTTP status codes
const errorIcons = {
  403: 'https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/ResponseCode/403%20Forbidden.png',
  404: 'https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/ResponseCode/404%20NotFound.png',
  418: 'https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/ResponseCode/418%20I\'m%20a%20teapot.png',
  500: 'https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/ResponseCode/500%20InternalServerError.png',
  503: 'https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/ResponseCode/503%20ServiceUnavailable.png',
};

/**
 * Format a log message with timestamp and details.
 * @param {string} level - The log level (e.g., 'INFO', 'WARN', 'ERROR').
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 * @returns {string} Formatted log message.
 * 
 * ! Alert: This function assumes that JSON.stringify can handle all types in the details object
 */
const formatLog = (level, message, details) => {
  const time = new Date().toLocaleTimeString();
  const detailsText = details ? JSON.stringify(details) : '';
  return `[${time}] [${level}] ${message} ${detailsText}`;
};

/**
 * Log an info message.
 * @param {string} message - The log message.
 * @param {Object} [details] - Additional details to log.
 * 
 * * Highlight: This function respects the log level set in the config
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
 * 
 * * Highlight: This function respects the log level set in the config
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
 * 
 * ! Alert: This function will always log to console regardless of log level
 * TODO: Consider adding a severity level to errors for more granular control
 */
export const logError = (message, details, statusCode) => {
  console.error(formatLog('ERROR', message, details));
  
  if (config.log.showErrorToasts) {
    const icon = errorIcons[statusCode] || errorIcons[500];
    
    toast.error(
      <div className="flex items-center">
        <img src={icon} alt="Error Icon" className="w-12 h-12 mr-3" />
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
 * 
 * * Highlight: This function only logs when the log level is set to 'debug'
 */
export const logDebug = (message, details) => {
  if (config.log.level === 'debug') {
    console.debug(formatLog('DEBUG', message, details));
  }
};

// TODO: Implement log rotation or limiting for client-side logs to prevent console clutter
// TODO: Consider adding a way to send critical client-side logs to the server for monitoring