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
    defaultExpirationTime: 30, // Default expiration time option in minutes
    expirationOptions: [30, 60, 180, 720, 1440, 4320], // Available expiration time options in minutes
  },
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // Time window for rate limiting in milliseconds (15 minutes)
    max: 30, // Maximum number of requests per IP within the time window
  },
  // Logging configuration
  log: {
    level: 'debug', // Log level (options: 'error', 'warn', 'info', 'debug', 'trace')
  },
  // Secret key for encryption or session management
  secretKey: 'your_secret_key_here', // Replace with a strong, unique secret key
  // Server hostname or IP address
  hostname: '103.174.191.149', // Can be 'localhost', IP address, or domain name
  // Main application port
  port: 3000, // Port number for the main application server
  // Directory for storing uploaded files
  uploadDir: path.join(process.cwd(), 'uploads'), // Absolute path to upload directory
  // Port for the download server
  downloadPort: 3023, // Port number for the separate download server
  // Theme configuration
  theme: {
    default: 'system', // Default theme (options: 'light', 'dark', 'system')
  },
};

export default config;