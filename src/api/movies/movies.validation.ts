import * as Joi from 'joi';

const nullable = [null];
const ratings = [
  ...nullable,
  'G',
  'PG',
  'PG-13',
  'Ror NC-17',
];
const baseBody = Joi.object().keys({
  id: Joi.number().optional(),
  uid: Joi.string().uuid().optional(),
  title: Joi.string(),
  plot: Joi.string().allow(...nullable),
  releaseDate: Joi.date().allow(...nullable),
  actors: Joi.array().items(Joi.string()),
  duration: Joi.number().min(1).allow(...nullable),
  poster: Joi.string().uri().allow(...nullable),
  rating: Joi.string().valid(...ratings),
  author: Joi.string(),
  insertedTs: Joi.date().optional(),
  updatedTs: Joi.date().optional(),
});

interface IValidator {
  options: Joi.ValidationOptions;
  validator: {
    params?: object,
    headers?: object,
    query?: object,
    body?: object,
  };
}

export const index: IValidator = {
  options: {},
  validator: {
    query: Joi.object().keys({
      offset: Joi.number().optional(),
      page: Joi.number().min(1),
    }),
  },
};

export const show: IValidator = {
  options: { allowUnknown: false },
  validator: {
    params: Joi.object().keys({
      id: Joi.number().min(1).max(10).required(),
    }),
  },
};

export const create: IValidator = {
  options: {},
  validator: {
    body: baseBody,
  },
};

export const update: IValidator = {
  options: {},
  validator: {
    body: baseBody,
    params: Joi.object().keys({
      id: Joi.number().min(1).max(10).required(),
    }),
  },
};

export const destory: IValidator = {
  options: {},
  validator: {
    params: Joi.object().keys({
      id: Joi.number().min(1).max(10).required(),
    }),
  },
};
