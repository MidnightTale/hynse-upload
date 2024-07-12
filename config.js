// This file contains the configuration settings for the application.

const config = {
  redis: {
    host: 'localhost',
    port: 6379,
  },
  multer: {
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1024MB
    fileFilter: (req, file, cb) => {
      cb(null, true); // Accept any file type
    },
  },
  upload: {
    expiration: 3 * 60, // 1 hour
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 requests per windowMs
  },
  log: {
    level: 'debug', // Log level
  },
  secretKey: 'your_secret_key_here', // Add this line
  hostname: '103.174.191.149', // Add hostname
  port: 3000, // Add port
};

export default config;