// @perama: This is the main server file that sets up the Express server and integrates it with Next.js
// It handles custom routes for file uploads and downloads, and initializes necessary services

import express from 'express';
import next from 'next';
import { createServer } from 'http';
import figlet from 'figlet';
import config from './config';
import { logInfo, logError } from './src/utils/logUtil';
import { checkRedisStatus } from './src/utils/redisUtil';
import fileRoutes from './src/routes/fileRoutes';

// * Highlight: Development mode is determined by the NODE_ENV environment variable
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// * Highlight: Create separate Express instances for main and download servers
const server = express();
const downloadServer = express();

// @perama: Middleware setup
// * Highlight: Parse JSON and URL-encoded bodies
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// @perama: Custom file routes
// * Highlight: Mount file-related routes under the /api path
server.use('/api', fileRoutes);

// @perama: Handle Next.js requests
// * Highlight: All unhandled routes are passed to Next.js
server.all('*', (req, res) => {
  return handle(req, res);
});

// @perama: Setup download server
// * Highlight: Mount file routes directly on the root path for the download server
downloadServer.use('/', fileRoutes);

// @perama: Initialize the server and required services
const initializeServer = async () => {
  try {
    // * Highlight: Prepare the Next.js app
    await app.prepare();
    // * Highlight: Check Redis connection
    await checkRedisStatus();

    // * Highlight: Create HTTP servers for both main and download Express instances
    const httpServer = createServer(server);
    const downloadHttpServer = createServer(downloadServer);
    
    // * Highlight: Determine hostnames and ports based on configuration
    const mainHostname = config.main.usePublicDomain ? config.main.publicDomain : config.main.hostname;
    const mainPort = config.main.port;
    
    const downloadHostname = config.download.usePublicDomain ? config.download.publicDomain : config.download.hostname;
    const downloadPort = config.download.port;

    // * Highlight: Start the main server
    httpServer.listen(mainPort, (err) => {
      if (err) throw err;
      // * Highlight: Generate ASCII art for server startup
      figlet('StellarFileServer', (err, data) => {
        if (err) {
          logError('Error generating MOTD', { error: err.message });
        } else {
          console.log(data);
        }
        logInfo(`Main server running on http://${mainHostname}:${mainPort}`);
      });
    });

    // * Highlight: Start the download server
    downloadHttpServer.listen(downloadPort, (err) => {
      if (err) throw err;
      logInfo(`Download server running on http://${downloadHostname}:${downloadPort}`);
    });

  } catch (error) {
    // ! Alert: Log error and exit if server initialization fails
    logError('Error starting server', error);
    process.exit(1);
  }
};

// @perama: Handle unhandled rejections
// ! Alert: Log unhandled promise rejections to prevent silent failures
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', promise, 'reason:', reason);
});

// * Highlight: Start the server initialization process
initializeServer();

// TODO: Implement graceful shutdown handling for the servers
// TODO: Add health check endpoints for monitoring server status
// TODO: Implement rate limiting for API routes to prevent abuse
// TODO: Set up periodic Redis connection checks to ensure database availability