import { PubsController } from '../controller/pubs.controler/pubs.controller.js';
import { PubsMongoRepo } from '../repos/pubs/pubs.mongo.repo.js';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
// Import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:pubs:router');

export const pubsRouter = createRouter();
debug('Starting');

const repo = new PubsMongoRepo();
const controller = new PubsController(repo);

// Const interceptor = new Interceptor();

pubsRouter.post('/add', controller.create.bind(controller));
pubsRouter.patch('/addBeer/:id', controller.addBeer.bind(controller));
pubsRouter.patch('/delBeer/:id', controller.removeBeer.bind(controller));
pubsRouter.get('/', controller.getAll.bind(controller));
// PubsRouter.get(
//   '/:id',
//   interceptor.authorization.bind(interceptor),
//   controller.getById.bind(controller)
// );
// pubsRouter.get(
//   '/search',
//   interceptor.authorization.bind(interceptor),
//   controller.search.bind(controller)
// );
// pubsRouter.post(
//   '/add',
//   interceptor.authorization.bind(interceptor),
//   interceptor.authentication.bind(interceptor),
//   controller.create.bind(controller)
// );
// pubsRouter.patch(
//   '/:id',
//   interceptor.authorization.bind(interceptor),
//   interceptor.authentication.bind(interceptor),
//   controller.update.bind(controller)
// );
// pubsRouter.patch(
//   'addpubs/:id',
//   interceptor.authorization.bind(interceptor),
//   interceptor.authentication.bind(interceptor),
//   controller.update.bind(controller)
// );
// pubsRouter.delete(
//   '/:id',
//   interceptor.authorization.bind(interceptor),
//   interceptor.authentication.bind(interceptor),
//   controller.delete.bind(controller)
// );
