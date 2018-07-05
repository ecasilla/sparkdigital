import { celebrate } from 'celebrate';
import * as express from 'express';

import { hasRole, isAuthenticated } from '../../auth/auth.service';

import * as controller from './users.ctrl';
import {
  create as createValidator,
  destory as destoryValidator,
  index as indexValidator,
  show as showValidator,
 } from './users.validation';

const router: express.Router = express.Router();

const indexMiddleware = [
  hasRole('admin'),
  celebrate(indexValidator.validator, indexValidator.options),
];
const showMiddleware = [
  isAuthenticated(),
  celebrate(showValidator.validator, showValidator.options),
];
const createMiddleware = [
  celebrate(createValidator.validator, createValidator.options),
];

const delMiddleware = [
  hasRole('admin'),
  celebrate(destoryValidator.validator, destoryValidator.options),
];

router.post('/', createMiddleware, controller.create);
router.get('/', indexMiddleware, controller.index);
router.get('/:id', showMiddleware, controller.me);
router.delete('/:id', delMiddleware, controller.destroy);

export default router;
