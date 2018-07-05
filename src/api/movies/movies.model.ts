
import { dbconstants } from '../../config/constants';
import { ICRUD, IDB } from '../../db';

const { MOVIES } = dbconstants;

export interface IMovie {
  id: string;
  title: string;
  plot: string;
  releaseDate: Date;
  actors: string[];
  duration: number;
  poster: string;
  rating: string;
  insertedTs: Date;
  updatedTs: Date;
}

class Movies implements ICRUD<IMovie> {

  public create(movies: IMovie, db: IDB<IMovie>): Promise<IMovie[]> {
    return db.insert(MOVIES, movies);
  }
  public find(movie: IMovie, db: IDB<IMovie>): Promise<IMovie[]> {
    return db.findOne(MOVIES, movie.id);
  }
  public findAll(db: IDB<IMovie>): Promise<IMovie[]> {
    return db.findAll(MOVIES);
  }
  public update(movie: IMovie, db: IDB<IMovie>): Promise<IMovie[]> {
    return db.update(MOVIES, movie.id, movie);
  }
  public destroy(movie, db: IDB<IMovie>): Promise<IMovie> {
    return db.destroy(MOVIES, movie.id, movie);
  }
}

export const movies = new Movies();
