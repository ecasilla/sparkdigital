import * as express from 'express';
import { head, isEmpty } from 'lodash';

import db from '../../db';

import { handleError, respondWithResult } from '../../utils';

import { movies as Movies, IMovie } from './movies.model';
const store = new db<IMovie>();

export async function index(_, res: express.Response) {
  try {
    const movies = await Movies.findAll(store);
    return respondWithResult(res, 200, movies);
  } catch (error) {
    return handleError(res, 500, error);
  }
}

export async function show(req: express.Request, res: express.Response) {
  try {
    const movie = await Movies.find(req.params, store);
    return respondWithResult(res, 200, movie);
  } catch (error) {
    return handleError(res, 500, error);
  }
}

export async function create(req: express.Request, res: express.Response) {
  try {
    const movie = await Movies.create(req.body, store);
    return respondWithResult(res, 201, movie);
  } catch (error) {
    return handleError(res, 500, error);
  }
}

export async function update(req: express.Request, res: express.Response) {
  const id =  parseInt(req.params.id, 10);
  const todo = Object.assign<IMovie, { id: number }>(req.body, { id });
  try {
    const updatedMovie = await Movies.update(todo, store);
    return respondWithResult(res, 200, updatedMovie);
  } catch (error) {
    return handleError(res, 500, error);
  }
}

export async function destroy(req: express.Request, res: express.Response) {
  try {
    const movie = head(await Movies.find(req.params, store));
    if (isEmpty(movie)) {
      return respondWithResult(res, 204);
    }
    await Movies.destroy(movie, store);
    return respondWithResult(res, 200, movie);
  } catch (error) {
    return handleError(res, 500, error);
  }
}
