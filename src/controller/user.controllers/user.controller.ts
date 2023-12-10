import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';
import { LoginResponse } from '../../types/login.response.js';
import { User } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W9Final:users:controller');

export class UsersController extends Controller<User> {
  constructor(protected repo: UsersMongoRepo) {
    super(repo);
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
