/**
 * Main application file
 */

'use strict';

import * as express from 'express';
import * as http from 'http';

import config from './config';
// tslint:disable-next-line
import expressConf from './config/express';
import db from './db';
import routes from './routes';
import logger from './utils/logger';
// Setup server
const app = express();
const server = http.createServer(app);
expressConf(app);
routes(app);

// Start server
function startServer() {
  server.listen(config.port, (err) => {
    if (err) {
      logger.error('Cannot start the server', err);
      process.exit(1);
    }
    logger.info('Server listening on :%d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Shutdown server gracefully
function handleExit(options, err) {
  if (options.cleanup) {
    const actions = [server.close, db.destroy];
    actions.forEach((close, i) => {
      try {
        close(() => {
          if (i === actions.length - 1) {
            process.exit();
          }
        });
      } catch (err) {
        if (i === actions.length - 1) {
          process.exit();
        }
      }
    });
  }
  if (err) {
    logger.error(err);
  }
  if (options.exit) {
    process.exit();
  }
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));
process.on('unhandledRejection', handleExit.bind(null, { exit: true }));

// Expose app
exports = module.exports = app;
