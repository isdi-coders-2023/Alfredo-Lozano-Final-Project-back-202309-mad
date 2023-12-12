import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import { Auth } from '../services/auth.js';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo.js';

const debug = createDebug(
  'W9Final:Alt Rebel scum this is the interceptor:middleware'
);

export class Interceptor {
  constructor() {
    debug('instatiate');
  }

  authorization(req: Request, _res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, ' Unauthoriced');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.id = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.body.id;
      const userToAddID = req.params.id;
      const repoUsers = new UsersMongoRepo();
      const user = await repoUsers.getById(userToAddID);
      if (user.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }
}
