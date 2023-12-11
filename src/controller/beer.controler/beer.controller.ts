import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { Beer } from '../../entities/beer.model.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { HttpError } from '../../types/http.error.js';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';

const debug = createDebug('W9Final:beers:controller');

export class BeersControler extends Controller<Beer> {
  userRepo: UsersMongoRepo;
  constructor(protected repo: BeerMongoRepo) {
    super(repo);
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async createBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.params.id;
      const author = await this.userRepo.getById(userID);
      req.body.author = author;
      if (!req.file?.path)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.beerImg = imgData;
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
