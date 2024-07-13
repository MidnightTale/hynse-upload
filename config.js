// @perama: This file contains the configuration for the application
// It centralizes all configuration options for easy management

import path from 'path';

const config = {
  // * Highlight: Redis configuration
  redis: {
    host: 'localhost', // Redis server host (e.g., 'localhost', '127.0.0.1', or remote IP)
    port: 6379, // Redis server port (default: 6379)
  },

  // * Highlight: Multer configuration for file uploads
  multer: {
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max file size (in bytes)
    fileFilter: (req, file, cb) => {
      // TODO: Implement file type filtering if needed
      cb(null, true); // Accept any file type. Can be customized to filter specific file types
    },
  },

  // * Highlight: Upload configuration
  upload: {
    expiration: 3 * 60, // Default file expiration time in minutes (3 hours)
    url: '/api/upload', // API endpoint for file uploads
    defaultExpirationTime: 30, // Default expiration time option in minutes
    expirationOptions: [30, 60, 180, 720, 1440, 4320], // Available expiration time options in minutes
  },

  // * Highlight: Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // Time window for rate limiting in milliseconds (15 minutes)
    max: 30, // Maximum number of requests per IP within the time window
  },

  // * Highlight: Logging configuration
  log: {
    level: 'debug', // Log level (options: 'error', 'warn', 'info', 'debug', 'trace')
  },

  // ! Alert: Ensure to replace this with a strong, unique secret key
  secretKey: 'your_secret_key_here', // Secret key for encryption or session management

  // * Highlight: Main application configuration
  main: {
    hostname: 'localhost',
    port: 3000,
    publicDomain: 'upload.hynse.net', // New public domain for the main app
    usePublicDomain: true, // Set to true to use the public domain
  },

  // * Highlight: Download server configuration
  download: {
    hostname: 'localhost',
    port: 3023,
    publicDomain: 'share.hynse.net', // New public domain for the download server
    usePublicDomain: true, // Set to true to use the public domain
  },

  // * Highlight: Directory for storing uploaded files
  uploadDir: path.join(process.cwd(), 'uploads'), // Absolute path to upload directory

  // * Highlight: Theme configuration
  theme: {
    default: 'system', // Default theme (options: 'light', 'dark', 'system')
  },
};

// TODO: Implement environment-specific configurations (development, production, testing)
// TODO: Add validation for critical configuration values

// @param redis: Configuration object for Redis connection
// @param multer: Configuration object for Multer file upload middleware
// @param upload: Configuration object for file upload settings
// @param rateLimit: Configuration object for rate limiting
// @param log: Configuration object for logging
// @param main: Configuration object for the main application server
// @param download: Configuration object for the download server
// @param uploadDir: Path to the directory where uploaded files will be stored
// @param theme: Configuration object for theming options

export default config;