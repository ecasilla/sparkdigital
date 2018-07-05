import * as express from 'express';
import * as uuid from 'uuid';

export interface IAppRequest extends express.Request {
  context: {
    id: string,
  };
  user?: {
    id: string;
  };
}

export default function requestId(req: IAppRequest,
                                  res: express.Response,
                                  next: express.NextFunction) {
  const id =  uuid.v4();
  req.context = Object.assign({ id }, req.context);
  res.setHeader('X-REQUEST-ID', id);
  next();
}
