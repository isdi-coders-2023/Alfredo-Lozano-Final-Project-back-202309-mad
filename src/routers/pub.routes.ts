import { PubsController } from '../controller/pubs.controler/pubs.controller';
import { PubsMongoRepo } from '../repos/pubs/pubs.mongo.repo';
import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { Interceptor } from '../middleware/auth.interceptor';

const debug = createDebug('W9Final:pubs:router');

export const pubsRouter = createRouter();
debug('Starting');

const repo = new PubsMongoRepo();
const controller = new PubsController(repo);
// eslint-disable-next-line no-unused-vars
const interceptor = new Interceptor();

pubsRouter.post('/add', controller.create.bind(controller));
pubsRouter.patch('/addBeer/:id', controller.addBeer.bind(controller));
pubsRouter.patch('/delBeer/:id', controller.removeBeer.bind(controller));

// PubsRouter.get(
//   '/',
//   interceptor.authorization.bind(interceptor),
//   controller.getAll.bind(controller)
// );
// pubsRouter.get(
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
