import * as express from 'express';
import * as passport from 'passport';

import { signToken } from '../auth.service';

const router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) {
      return res.status(401).json({ error: JSON.stringify(error, null, 2) });
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' });
    }

    const token = signToken(user.id, user.role);
    return res.json({ token });
  })(req, res, next);
});

export default router;
