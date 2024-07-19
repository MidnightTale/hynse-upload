// @perama: This file contains the configuration for the application
// It centralizes all configuration options for easy management

import path from 'path';

const config = {
  // Redis configuration
  redis: {
    host: 'localhost', // Redis server host (e.g., 'localhost', '127.0.0.1', or remote IP)
    port: 6379, // Redis server port (default: 6379)
    keyPrefix: {
      session: 'session:',
    },
  },
  // Multer configuration for file uploads
  multer: {
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max file size (in bytes)
    forbiddenExtensions: ['.exe', '.scr', '.cpl', '.jar'],
    forbiddenPrefixes: ['.doc'],
    forbiddenMimeTypes: [
      'application/x-msdownload',
      'application/x-executable',
      'application/x-dosexec',
      'application/java-archive',
      'application/vnd.microsoft.portable-executable'
    ],
    fileFilter: (req, file, cb) => {
      // This will be implemented in fileRoutes.js
    },
  },
  // Upload configuration
  upload: {
    url: '/api/upload', // API endpoint for file uploads
    defaultExpirationTime: 60, // Default expiration time option in minutes
    expirationOptions: [ 60, 180, 720, 1440, 4320], // Available expiration time options in minutes
    archivePrefix: 'archive',
  },
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // Time window for rate limiting in milliseconds (15 minutes)
    max: 30, // Maximum number of requests per IP within the time window
  },
  // Logging configuration
  log: {
    level: 'trace', // Log level (options: 'error', 'warn', 'info', 'debug', 'trace')
    sanitize: false, // Set to false to disable log sanitization
    logUploads: true, // Set to true to log upload requests
    logDownloads: true, // Set to true to log download requests
    logRequests: true, // Set to true to log incoming requests
    traceErrors: true, // Set to true to include stack traces for errors
    showErrorToasts: true, // Set to true to show error toasts
  },
  // Error simulation configuration
  errorSimulation: {
    enabled: false, // Set to true to enable error simulation
    probability: 0.5, // Probability of simulating an error (0.1 = 10% chance)
    uploadError: true, // Simulate errors during file upload
    downloadError: true, // Simulate errors during file download
  },
  // Secret key for encryption or session management
  secretKey: 'your_secret_key_here', // Replace with a strong, unique secret key
  // Main application configuration
  main: {
    hostname: 'localhost',
    port: 3000,
    publicDomain: 'upload.hynse.net', // New public domain for the main app
    usePublicDomain: true, // Set to true to use the public domain
  },
  // Download server configuration
  download: {
    hostname: 'localhost',
    port: 3023,
    publicDomain: 'share.hynse.net', // New public domain for the download server
    usePublicDomain: true, // Set to true to use the public domain
  },
  // Directory for storing uploaded files
  uploadDir: path.join(process.cwd(), 'uploads'), // Absolute path to upload directory
  // Theme configuration
  theme: {
    default: 'system', // Default theme (options: 'light', 'dark', 'system')
  },
  // Admin configuration
  admin: {
    enabled: true, // Set to true to enable admin features
    username: 'admin', // Default admin username
    password: 'changeme', // Default admin password (change this!)
    jwtExpirationTime: '1h',
  },
  // Session configuration
  session: {
    expirationTime: 180000, // Session expiration time in milliseconds (3 minutes)
    usageLimit: 69, // Maximum number of session key uses
  },
  // Cleanup configuration
  cleanup: {
    deletionDelay: 0, // Delay in milliseconds before file deletion
    schedulerInterval: 60000, // Interval in milliseconds to run the cleanup scheduler
    batchSize: 100, // Number of files to process in each cleanup batch
  },
};

export default config;