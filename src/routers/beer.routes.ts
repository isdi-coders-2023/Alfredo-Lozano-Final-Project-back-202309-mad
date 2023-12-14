import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';
import { BeersControler } from '../controller/beer.controler/beer.controller.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
// Import { Interceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:beer:router');

export const beersRouter = createRouter();
debug('Starting');

const repo = new BeerMongoRepo();
const controller = new BeersControler(repo);
const fileInterceptor = new FileInterceptor();
// Const interceptor = new Interceptor();

beersRouter.post(
  '/:id',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.createBeer.bind(controller)
);
<<<<<<< HEAD
beersRouter.get('/', controller.getAll.bind(controller));
=======
beersRouter.get(
  '/',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.getAll.bind(controller)
);
beersRouter.get(
  '/:id',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.getById.bind(controller)
);
>>>>>>> ef75a71d6122f24ea18af1b5231767a43350af0d
