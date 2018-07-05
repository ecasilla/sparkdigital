import { find, isEmpty } from 'lodash';
import * as uuid from 'uuid';

import { users } from '../api/users/users.model';
import { dbconstants } from '../config/constants';

const { MOVIES, USERS  } = dbconstants;

function genAdmin() {
  const password = users.updatePasswordSync('testing1');
  return {
    password,
    username: 'spark',
    role: 'admin',
    uid: uuid.v4(),
    id: 1,
    insertedTs: new Date().toISOString(),
  };
}
export interface ICRUD<T> {
  create(entity: T, db: IDB<T>): Promise<T[]>;
  destroy(entity: T, db: IDB<T>): Promise<T>;
  find(entity: T, db: IDB<T>): Promise<T[]>;
  findAll(db: IDB<T>): Promise<T[]>;
  update(entity: T, db: IDB<T>): Promise<T[]>;
}

export interface IDB<T> {
  findOne(namespace: string, id: string): Promise<T[]>;
  findAll(namespace: string): Promise<T[]>;
  update(namespace: string, id: string, entity: T): Promise<T[]>;
  insert(namespace: string, entity: T): Promise<T[]>;
  destroy(namespace: string, id: string, entity: T): Promise<T>;
  where(namespace: string, key: string, value: string): Promise<T[]>;
}

let memory = {};

class DB<T> implements IDB<T> {
  private memory: Object;

  static destroy(callback?: Function | undefined) {
    if (callback) return callback();
    return;
  }
  constructor() {
    const admin = genAdmin();
    if (isEmpty(memory)) {
      memory = {
        [`${USERS}Seq`]: 1,
        [`${MOVIES}Seq`]: 0,
        [USERS]: [admin],
        [MOVIES]: [],
      };
    }
    this.memory = memory;
  }
  findOne(namespace: string, id: string) {
    const entity = this.memory[namespace];
    const d = find(entity, e => e.id === parseInt(id, 10));
    if (isEmpty(d)) {
      return Promise.resolve([]);
    }
    return Promise.resolve([d]);
  }
  findAll(namespace: string) {
    return Promise.resolve(this.memory[namespace]);
  }
  update(namespace: string, id: string, entity: T & {updatedTs}) {
    const baseEntity = this.memory[namespace];
    const element = find(baseEntity, e => e.id === parseInt(id, 10));
    if (isEmpty(element || isEmpty(entity))) throw new Error(`Entity was not found for id: ${id}`);
    entity.updatedTs = new Date().toISOString();
    return Promise.resolve([Object.assign<T, T>(element, entity)]);
  }
  insert(namespace: string, entity: T & {id, uid, insertedTs}) {
    const baseEntity = this.memory[namespace];
    const seq = this.memory[`${namespace}Seq`] += 1;
    entity.uid = uuid.v4();
    entity.id = seq;
    entity.insertedTs = new Date().toISOString();
    this.memory[namespace] = [...[entity], ...baseEntity];
    return Promise.resolve([entity]);
  }
  destroy(namespace: string, id: string, entity: T) {
    const baseEntity = this.memory[namespace];
    this.memory[namespace] = baseEntity.filter(e => e.id !== id);
    return Promise.resolve(entity);
  }
  where(namespace: string, key: string, value: string): Promise<T[]> {
    const baseEntity = this.memory[namespace];
    const d = find(baseEntity, e => e[key] === value);
    if (isEmpty(d)) {
      return Promise.resolve([]);
    }
    return Promise.resolve([d]);
  }
}

export default DB;
