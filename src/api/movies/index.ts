import { celebrate } from 'celebrate';
import * as express from 'express';

import { isAuthenticated } from '../../auth/auth.service';

import * as controller from './movies.ctrl';
import {
  create as createValidator,
  destory as destoryValidator,
  index as indexValidator,
  show as showValidator,
  update as updateValidator,
 } from './movies.validation';

const router: express.Router = express.Router();

const indexMiddleware = [
  isAuthenticated(),
  celebrate(indexValidator.validator, indexValidator.options),
];
const showMiddleware = [
  isAuthenticated(),
  celebrate(showValidator.validator, showValidator.options),
];
const createMiddleware = [
  celebrate(createValidator.validator, createValidator.options),
];
const updateMiddleware = [
  isAuthenticated(),
  celebrate(updateValidator.validator, updateValidator.options),
];
const delMiddleware = [
  isAuthenticated(),
  celebrate(destoryValidator.validator, destoryValidator.options),
];

router.get('/', indexMiddleware, controller.index);
router.get('/:id', showMiddleware, controller.show);
router.post('/', createMiddleware, controller.create);
router.put('/:id', updateMiddleware, controller.update);
router.delete('/:id', delMiddleware, controller.destroy);

export default router;
