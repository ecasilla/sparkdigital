import * as express from 'express';

import logger from './logger';

export function respondWithResult(res: express.Response, statusCode = 200, entity?) {
  if (entity) {
    return res.status(statusCode).json(entity);
  }
  return res.status(statusCode).json([]);
}

export function validationError(res: express.Response, statusCode = 422, err: Error) {
  return res.status(statusCode).json(err);
}

export function handleError(res: express.Response, statusCode = 500, err: Error) {
  logger.error(err);
  return res.status(statusCode).json(err);
}
