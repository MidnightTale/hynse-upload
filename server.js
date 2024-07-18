import express from 'express';
import next from 'next';
import { createServer } from 'http';
import figlet from 'figlet';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import config from './config';
import { logInfo, logError, logWarn } from './src/utils/logUtil';
import { checkRedisStatus } from './src/utils/redisUtil';
import fileRoutes from './src/routes/fileRoutes';
import { logRequest } from './src/utils/requestLogUtil';
import rateLimit from 'express-rate-limit';
import { getIp } from './src/utils/ipUtil';

const checkConfigFile = () => {
  const configPath = path.join(process.cwd(), 'config.js');
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('Error: config.js file not found. Please create a config.js file in the root directory.'));
    process.exit(1);
  }
};

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const downloadServer = express();

// Configure Express to trust the first proxy
server.set('trust proxy', 1);
downloadServer.set('trust proxy', 1);

// Middleware setup
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Add request logging middleware
server.use(logRequest);

// Custom file routes
server.use('/api', fileRoutes);

// Define rate limit rules
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => getIp(req),
});

const downloadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 download requests per minute
  message: 'Too many download requests from this IP, please try again later.',
  keyGenerator: (req) => getIp(req),
});

// Apply rate limiting to all routes
server.use(apiLimiter);

downloadServer.use('/api/download', downloadLimiter);

// Handle Next.js requests
server.all('*', (req, res) => {
  return handle(req, res);
});

// Setup download server
downloadServer.use('/', fileRoutes);

// Add request logging middleware to download server
downloadServer.use(logRequest);

// Function to list all routes
const listRoutes = (app) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        method: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
      });
    } else if (middleware.name === 'router') {
      // Routes added as router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        route &&
          routes.push({
            path: route.path,
            method: Object.keys(route.methods).join(', ').toUpperCase(),
          });
      });
    }
  });
  return routes;
};

// Initialize the server and required services
const initializeServer = async () => {
  try {// Load MOTD first
    await new Promise((resolve, reject) => {
      figlet('Hynse Upload', (err, data) => {
        if (err) {
          logError('Error generating MOTD', { error: err.message });
          reject(err);
        } else {
          console.log(data);
          resolve();
        }
      });
    });
    // Check for config.js file
    logInfo('Checking for config.js file...');
    const verifyConfig = Date.now();
    try {
      checkConfigFile();
      const endConfig = Date.now();
      const configTime = endConfig - verifyConfig;
      logInfo(`config.js file found and loaded successfully ${chalk.grey(`(${configTime}ms)`)}`);
    } catch (error) {
      logError('Error checking config.js file', { error: error.message });
      throw error;
    }

    

    // Verify Redis connection
    const redisPromise = (async () => {
      try {
        logInfo('Verifying Redis connection...');
        const startRedis = Date.now();
        await checkRedisStatus();
        const endRedis = Date.now();
        const redisTime = endRedis - startRedis;
        logInfo(`Redis is running and connected ${chalk.grey(`(${redisTime}ms)`)}`);
      } catch (error) {
        logError('Error verifying Redis connection', { error: error.message });
        throw new Error('Failed to connect to Redis');
      }
    })();

    // Prepare Next.js
    const nextJsPromise = (async () => {
      try {
        logInfo('Starting Next.js...');
        const startNextJs = Date.now();
        await app.prepare();
        const endNextJs = Date.now();
        const nextJsTime = endNextJs - startNextJs;
        logInfo(`Next.js is running ${chalk.grey(`(${nextJsTime}ms)`)}`);
      } catch (error) {
        logError('Error starting Next.js', { error: error.message });
        throw new Error('Failed to start Next.js');
      }
    })();

    // Run Redis and Next.js initialization tasks in parallel
    await Promise.all([redisPromise, nextJsPromise]);

    // Create HTTP servers
    const httpServer = createServer(server);
    const downloadHttpServer = createServer(downloadServer);

    const mainHostname = config.main.usePublicDomain ? config.main.publicDomain : config.main.hostname;
    const mainPort = config.main.port;

    const downloadHostname = config.download.usePublicDomain ? config.download.publicDomain : config.download.hostname;
    const downloadPort = config.download.port;

    // Start main server
    const startMainServer = Date.now();
    httpServer.listen(mainPort, (err) => {
      if (err) {
        logError('Error starting main server', err);
        process.exit(1);
      }
      const endMainServer = Date.now();
      const mainServerTime = endMainServer - startMainServer;
      const mainServerUrl = config.main.usePublicDomain ? `https://${mainHostname}` : `http://${mainHostname}:${mainPort}`;
      logInfo(`Main server running on ${chalk.cyan(mainServerUrl)} ${chalk.grey(`(${mainServerTime}ms)`)}`);
    });

    // Start download server
    const startDownloadServer = Date.now();
    downloadHttpServer.listen(downloadPort, (err) => {
      if (err) {
        logError('Error starting download server', err);
        process.exit(1);
      }
      const endDownloadServer = Date.now();
      const downloadServerTime = endDownloadServer - startDownloadServer;
      const downloadServerUrl = config.download.usePublicDomain ? `https://${downloadHostname}` : `http://${downloadHostname}:${downloadPort}`;
      logInfo(`Download server running on ${chalk.cyan(downloadServerUrl)} ${chalk.grey(`(${downloadServerTime}ms)`)}`);
    });

    // List current API routes
    const routes = listRoutes(server);
    const routeLogs = routes.map(route => `${chalk.cyan(route.path)} ${chalk.yellow(route.method)}`).join(' | ');
    logInfo(`Current API routes:${chalk.magenta(routeLogs)}`);

  } catch (error) {
    logError('Error starting server', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', promise, 'reason:', reason);
});

initializeServer();