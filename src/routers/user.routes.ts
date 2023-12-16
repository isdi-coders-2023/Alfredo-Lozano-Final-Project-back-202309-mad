import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo.js';
import { UsersController } from '../controller/user.controllers/user.controller.js';
import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:user:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new Interceptor();

usersRouter.post('/register', controller.create.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  controller.addBeer.bind(controller)
);
usersRouter.patch('/delBeer/:id', controller.removeBeer.bind(controller));
usersRouter.get('/:id', controller.getById.bind(controller));
usersRouter.patch('/delBeer/:id', controller.removeBeer.bind(controller));
