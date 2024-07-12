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

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const downloadServer = express();

// @perama: Middleware setup
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// @perama: Custom file routes
server.use('/api', fileRoutes);

// @perama: Handle Next.js requests
server.all('*', (req, res) => {
  return handle(req, res);
});

// @perama: Setup download server
downloadServer.use('/', fileRoutes);

// @perama: Initialize the server and required services
const initializeServer = async () => {
  try {
    await app.prepare();
    await checkRedisStatus();

    const httpServer = createServer(server);
    const downloadHttpServer = createServer(downloadServer);
    
    const mainHostname = config.main.usePublicDomain ? config.main.publicDomain : config.main.hostname;
    const mainPort = config.main.port;
    
    const downloadHostname = config.download.usePublicDomain ? config.download.publicDomain : config.download.hostname;
    const downloadPort = config.download.port;

    httpServer.listen(mainPort, (err) => {
      if (err) throw err;
      figlet('StellarFileServer', (err, data) => {
        if (err) {
          logError('Error generating MOTD', { error: err.message });
        } else {
          console.log(data);
        }
        logInfo(`Main server running on http://${mainHostname}:${mainPort}`);
      });
    });

    downloadHttpServer.listen(downloadPort, (err) => {
      if (err) throw err;
      logInfo(`Download server running on http://${downloadHostname}:${downloadPort}`);
    });

  } catch (error) {
    logError('Error starting server', error);
    process.exit(1);
  }
};

// @perama: Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', promise, 'reason:', reason);
});

initializeServer();