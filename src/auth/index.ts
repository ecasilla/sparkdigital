
import * as express from 'express';

import { users } from '../api/users/users.model';
import config from '../config';

import local from './local';

// Passport Configuration
require('./local/passport').setup(users, config);

const router = express.Router();

router.use('/login', local);

export default router;
