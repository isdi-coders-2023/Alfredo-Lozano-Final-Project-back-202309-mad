import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../controller.js';
import { Pubs } from '../../entities/pubs.model.js';
import { PubsMongoRepo } from '../../repos/pubs/pubs.mongo.repo.js';
import { HttpError } from '../../types/http.error.js';
import { Beer } from '../../entities/beer.model.js';

const debug = createDebug('W9Final:pubs:controller');

export class PubsController extends Controller<Pubs> {
  constructor(protected repo: PubsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const pubId = await this.repo.getById(req.body.id);
      const beer = req.params.id;
      if (!pubId) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (pubId.beers.includes(beer as unknown as Beer)) {
        throw new HttpError(
          404,
          'Beer Found',
          'Update not possible, Beer already in you taste beer'
        );
      }

      const result = await this.repo.addBeer(req.params.id, pubId.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.removeBeer(req.params.id, req.body.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
