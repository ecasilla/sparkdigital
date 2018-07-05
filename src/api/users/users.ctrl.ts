import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { head, isEmpty } from 'lodash';

import config from '../../config';
import db from '../../db';
import { handleError, respondWithResult, validationError } from '../../utils';

import { users as User, IUser } from './users.model';
const store = new db<IUser>();

/**
 * Get list of users
 * restriction: 'admin'
 */
export async function index(_, res: express.Response) {
  try {
    const users = await User.findAll(store);
    respondWithResult(res, 200, users);
  } catch (error) {
    handleError(res, 500, error);
  }
}

/**
 * Creates a new user
 */
export async function create(req: express.Request,
                             res: express.Response,
                             next: express.NextFunction) {
  try {
    const user = head(await User.create(req.body, store));
    if (isEmpty(user) || !user) {
      return next(new Error('Could not create user'));
    }
    const token = jwt.sign({ id: user.id, role: user.role }, config.secrets.session as string, {
      expiresIn: config.secrets.expiresIn,
    });
    return res.json({ token });
  } catch (error) {
    return validationError(res, 500, error);
  }
}

/**
 * Get a single user
 */
export async function me(req: express.Request, res: express.Response) {
  try {
    const user = await User.find(req.params, store);
    respondWithResult(res, 200, user);
  } catch (error) {
    handleError(res, 500, error);
  }
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export async function destroy(req: express.Request, res: express.Response) {
  try {
    const user = head(await User.find(req.params, store));
    if (isEmpty(user)) {
      return respondWithResult(res, 204);
    }
    await User.destroy(user, store);
    return respondWithResult(res, 200, user);
  } catch (error) {
    return handleError(res, 500, error);
  }
}

/**
 * Authentication callback
 */
export function authCallback(_, res) {
  res.redirect('/');
}
