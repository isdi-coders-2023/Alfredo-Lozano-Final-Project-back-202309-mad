import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../controller';
import { Pubs } from '../../entities/pubs.model';
import { PubsMongoRepo } from '../../repos/pubs/pubs.mongo.repo';

const debug = createDebug('W9Final:pubs:controller');

export class PubsController extends Controller<Pubs> {
  constructor(protected repo: PubsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.addBeer(req.params.id, req.body);
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
