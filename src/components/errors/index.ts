/**
 * Error responses
 */

'use strict';
import * as express from 'express';

const errorView = (status: number) => (_, res: express.Response) => {
  const viewFilePath = status.toString();
  res.render(viewFilePath, {}, (err, html) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.send(html);
  });
};

export default {
  401: errorView,
  403: errorView,
  404: errorView,
  500: errorView,
};
