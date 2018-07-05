import * as compose from 'composable-middleware';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import * as jwt from 'jsonwebtoken';

import { users as User, IUser } from '../api/users/users.model';
import config from '../config';
import db from '../db';
const store = new db<IUser>();

const validateJwt = expressJwt({
  secret: config.secrets.session as string,
});

const findUser = async (err: Error,
                        req: express.Request,
                        res: express.Response,
                        next: express.NextFunction) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).send('Invalid token...');
  }
  try {
    if (req.user) {
      const entity = await User.findOne(req.user.id, store);
      req.user = entity[0];
      return next();
    }
    return res.status(401).end();
  } catch (err) {
    return next(err);
  }
};

const validateToken = (req: express.Request,
                       res: express.Response,
                       next: express.NextFunction) => {
  // allow access_token to be passed through query parameter as well
  if (req.query && req.query.hasOwnProperty('access_token')) {
    req.headers.authorization = `Bearer ${req.query.access_token}`;
  }
 // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
  if (req.query && typeof req.headers.authorization === 'undefined') {
    req.headers.authorization = `Bearer ${req.cookies.token}`;
  }
  validateJwt(req, res, next);
};
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(validateToken)
    // Attach user to request
    .use(findUser);
}

const meetsRequirements = roleRequired => (req: express.Request,
                                           res: express.Response,
                                           next: express.NextFunction) => {
  if (req.user &&
    config.userRoles.indexOf(req.user.role) >=
    config.userRoles.indexOf(roleRequired)) {
    return next();
  }
  return res.status(403).send('Forbidden');
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(meetsRequirements(roleRequired));
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
  return jwt.sign({ id, role }, config.secrets.session as string, {
    expiresIn: config.secrets.expiresIn,
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = signToken(req.user.id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
}
