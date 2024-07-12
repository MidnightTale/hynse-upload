import { parse } from 'url';
import next from 'next';
import { logInfo, logError, logWarn, logDebug } from './src/utils/logUtil';
import { getIp } from './src/utils/ipUtil';
import config from './config';
import figlet from 'figlet';
import chalk from 'chalk';
import { checkRedisStatus } from './src/utils/redisUtil';
import { createServer } from 'http';

const dev = process.env.NODE_ENV !== 'production'
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
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const clientIp = getIp(req);
      
      handle(req, res, parsedUrl).catch((err) => {
        logError(`Error occurred handling ${req.url}`, { error: err.message, clientIp });
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }).listen(port, (err) => {
      if (err) throw err;
      logInfo(`StellarFileServer is ready on http://${hostname}:${port}`);
    });
  });
});