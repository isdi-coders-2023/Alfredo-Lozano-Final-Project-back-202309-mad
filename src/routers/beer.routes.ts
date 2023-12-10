import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { BeerMongoRepo } from '../repos/beer/beer.mongo.repo.js';
import { BeersControler } from '../controller/beer.controler/beer.controller.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('W9Final:beer:router');

export const beersRouter = createRouter();
debug('Starting');

const repo = new BeerMongoRepo();
const controller = new BeersControler(repo);
const fileInterceptor = new FileInterceptor();

beersRouter.post(
  '/add',
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.create.bind(controller)
);
