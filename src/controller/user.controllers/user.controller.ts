import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';
import { LoginResponse } from '../../types/login.response.js';
import { User } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';

import { Beer } from '../../entities/beer.model.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';

const debug = createDebug('W9Final:users:controller');

export class UsersController extends Controller<User> {
  beerRepo: BeerMongoRepo;
  constructor(protected repo: UsersMongoRepo) {
    super(repo);

    this.beerRepo = new BeerMongoRepo();
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.id);
      console.log('usuario', user);
      const beer = await this.beerRepo.getById(req.params.id);
      console.log('cerveza', beer);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      console.log('preprobada');
      if (user.probada.includes(beer as unknown as Beer)) {
        throw new HttpError(
          404,
          'Beer Found',
          'Update not possible, Beer already in you taste beer'
        );
      }

      console.log('preupdate');
      const updatedUser = await this.repo.addBeer(await beer, user.id);
      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedUser);
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
