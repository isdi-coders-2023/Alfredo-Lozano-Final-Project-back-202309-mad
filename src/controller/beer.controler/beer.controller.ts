import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { Beer } from '../../entities/beer.model.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9Final:beers:controller');

export class BeersControler extends Controller<Beer> {
  constructor(protected repo: BeerMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.beerImg = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
