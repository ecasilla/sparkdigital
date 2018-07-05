import * as bcrypt from 'bcrypt';
import { pick } from 'lodash';

import { dbconstants } from '../../config/constants';
import { ICRUD, IDB } from '../../db';

const { USERS } = dbconstants;

export interface IUser {
  id: string;
  username: string;
  password?: string;
  role: string;
  insertedTs?: Date;
  updatedTs?: Date;
}

const saltRounds = 10;
const allowedFields = [
  'id',
  'uid',
  'username',
  'role',
  'insertedTs',
  'updatedTs',
];

const sanitizeUsers = users => users.map(u => pick(u, allowedFields) as IUser);

class Users implements ICRUD<IUser> {

  public async create(user: IUser, db: IDB<IUser>): Promise<IUser[]> {
    user.role = 'user';
    user.password = await this.updatePassword(user.password);
    return db.insert(USERS, user);
  }
  public find(user: IUser, db: IDB<IUser>): Promise<IUser[]> {
    return db.findOne(USERS, user.id)
    .then(sanitizeUsers);
  }
  public findOne(id: string, db: IDB<IUser>): Promise<IUser[]> {
    return db.findOne(USERS, id).then(sanitizeUsers);
  }
  public findAll(db: IDB<IUser>): Promise<IUser[]> {
    return db.findAll(USERS).then(sanitizeUsers);
  }
  public findByUserName(name: string, db: IDB<IUser>): Promise<IUser[]> {
    return db.where(USERS, 'username', name);
  }
  public update(user: IUser, db: IDB<IUser>): Promise<IUser[]> {
    return db.update(USERS, user.id, user).then(sanitizeUsers);
  }
  public destroy(user, db: IDB<IUser>): Promise<IUser> {
    return db.destroy(USERS, user.id, user);
  }
  public authenticate(user, password) {
    return bcrypt.compare(password, user.password);
  }
  public async updatePassword(password): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
  public updatePasswordSync(password): string {
    return bcrypt.hashSync(password, saltRounds);
  }
}

export const users = new Users();

export interface IUserModel extends IDB<IUser> {
  authenticate(user: IUser, password: string): Promise<boolean>;
  updatePassword(password: string): Promise<string>;
  updatePasswordSync(password): string;
  findByUserName(name: string, db: IDB<IUser>): Promise<IUser[]>;
}
