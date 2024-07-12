// This file sets up the StellarFileServer and handles incoming requests.

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { logInfo, logError, logWarn, logDebug } = require('./src/utils/logUtil');
const { getIp } = require('./src/utils/ipUtil');
const config = require('./config').default; // Import config
const figlet = require('figlet'); // Import figlet
const chalk = require('chalk'); // Import chalk
const { checkRedisStatus } = require('./src/utils/redisUtil'); // Import checkRedisStatus

const dev = config.nodeENV !== 'production';
const hostname = config.hostname;
const port = config.port;

// Generate and log the MOTD
figlet('StellarFileServer', (err, data) => {
  if (err) {
    logError('Error generating MOTD', { error: err.message });
    return;
  }
  console.log(data);

  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  const checkServices = async () => {
    const start = Date.now();
    try {
      logInfo('Starting server...');

      const redisCheck = (async () => {
        logInfo('Connecting to Redis...');
        const redisStart = Date.now();
        await checkRedisStatus();
        logInfo(`Redis done in ${Date.now() - redisStart}ms`);
      })();

      const nextCheck = (async () => {
        logInfo('Starting Next.js...');
        const nextStart = Date.now();
        await app.prepare();
        logInfo(`Next.js done in ${Date.now() - nextStart}ms`);
      })();

      await Promise.all([redisCheck, nextCheck]);

      logInfo(`Server and all services are up and running. (${Date.now() - start}ms)`);
    } catch (error) {
      logError('Startup failed', { error: error.message });
      process.exit(1);
    }
  };

  checkServices().then(() => {
    createServer(async (req, res) => {
      const clientIp = getIp(req);

      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        logError(`Error occurred handling ${req.url}`, { error: err.message });
        res.statusCode = 500;
        res.end('Internal server error');
      }
    })
      .once('error', (err) => {
        logError('Server error', { error: err.message });
        process.exit(1);
      })
      .listen(port, hostname, () => {
        logInfo(`StellarFileServer is ready on http://${hostname}:${port}`);
      });
  });
});