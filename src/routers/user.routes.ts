import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo.js';
import { UsersController } from '../controller/user.controllers/user.controller.js';
// Import { Interceptor } from '../middleware/auth.interceptor';

/* istanbul ignore next */
const debug = createDebug('W9Final:user:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
// Const interceptor = new Interceptor();

usersRouter.post('/login', controller.login.bind(controller));
usersRouter.post('/register', controller.create.bind(controller));
