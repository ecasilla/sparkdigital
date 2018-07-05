import { head, isEmpty } from 'lodash';
import * as passport from 'passport';

import { IStrategyOptions,
  Strategy as LocalStrategy,
  VerifyFunction } from 'passport-local';

import { IUser, IUserModel } from '../../api/users/users.model';
import db from '../../db';
const store = new db<IUser>();

async function localAuthenticate(user: IUserModel, name: string, password: string, done) {
  try {
    const u = head(await user.findByUserName(name, store));
    if (isEmpty(u) || !u) {
      return done(null, false, {
        message: 'This user is not registered.',
      });
    }
    const authenticated = await user.authenticate(u, password);
    if (!authenticated) {
      return done(null, false, { message: 'This password is not correct.' });
    }
    return done(null, u);
  } catch (error) {
    done(error);
  }
}

export function setup(user) {
  const map: IStrategyOptions =  {
    usernameField: 'username',
    passwordField: 'password',
  };
  const handler: VerifyFunction =
  (id, password, done) => localAuthenticate(user, id, password, done);
  const strategy = new LocalStrategy(map, handler);
  passport.use(strategy);
}
