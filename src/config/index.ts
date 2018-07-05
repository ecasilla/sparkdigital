import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const config = {
  basepath: process.env.API_BASE,
  port: process.env.PORT,
  root: path.join(process.cwd(), 'dist'),
  serviceName: process.env.SERVICE_NAME,
  secrets: {
    session: process.env.SECRET,
    expiresIn: 60 * 60 * 5,
  },
  userRoles: [
    'admin',
    'user',
  ],
};

export default config;
