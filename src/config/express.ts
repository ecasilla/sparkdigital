/**
 * Express configuration
 */

import * as bodyParser from 'body-parser';
import { errors } from 'celebrate';
import * as cookieParser from 'cookie-parser';
import * as ejs from 'ejs';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as expressPino from 'express-pino-logger';
import * as methodOverride from 'method-override';
import * as passport from 'passport';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as shrinkRay from 'shrink-ray';

import requestId from '../components/middleware/requestId';
import logger from '../utils/logger';

import index from './index';

export default function (app: express.Application) {
  const env = app.get('env');

  if (env === 'production') {
    app.use(
      favicon(path.join(index.root, `${index.root}/views`, 'favicon.ico')),
    );
  }
  app.use(requestId);
  app.use(express.static(`${index.root}/views`));

  app.set('views', `${index.root}/views`);
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(
    expressPino({
      logger,
      genReqId: req => req.context.id,
    }),
  );
  app.use(errors());
  app.disable('x-powered-by');
  if (env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
