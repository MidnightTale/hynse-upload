// @perama: This file contains the configuration for the application
// It centralizes all configuration options for easy management

import path from 'path';

const config = {
  // Redis configuration
  redis: {
    host: 'localhost', // Redis server host (e.g., 'localhost', '127.0.0.1', or remote IP)
    port: 6379, // Redis server port (default: 6379)
  },
  // Multer configuration for file uploads
  multer: {
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB max file size (in bytes)
    fileFilter: (req, file, cb) => {
      cb(null, true); // Accept any file type. Can be customized to filter specific file types
    },
  },
  // Upload configuration
  upload: {
    expiration: 3 * 60, // Default file expiration time in minutes (3 hours)
    url: '/api/upload', // API endpoint for file uploads
    defaultExpirationTime: 1, // Default expiration time option in minutes
    expirationOptions: [ 1, 30, 60, 180, 720, 1440, 4320], // Available expiration time options in minutes
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
  },
};

export default config;