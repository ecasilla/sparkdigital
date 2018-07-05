import * as Joi from 'joi';

const baseBody = Joi.object().keys({
  id: Joi.number().optional(),
  uid: Joi.string().uuid().optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  role: Joi.string().optional(),
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
    body: baseBody.keys({
      username: Joi.string().optional(),
    }),
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

export const destory: IValidator = {
  options: {},
  validator: {
    params: Joi.object().keys({
      id: Joi.number().min(1).max(10).required(),
    }),
  },
};
