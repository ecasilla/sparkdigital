/**
 * Main application routes
 */
import * as path from 'path';

import { Application } from 'express';

import movies from './api/movies';
import users from './api/users';
import auth from './auth';
import errors from './components/errors';
import config from './config';

export default function router(app: Application) {
    // Insert routes below
  app.use(`${config.basepath}movies`, movies);
  app.use(`${config.basepath}users`, users);
  app.use('/auth', auth);

    // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|views|assets)/*').get(errors[404](404));

    // All other routes should redirect to the index.html
  app.route('/*')
        .get((_, res) => {
          res.sendFile(path.resolve(`${config.root}/views/index.html`));
        });
}
