import { PubsController } from '../controller/pubs.controler/pubs.controller';
import { PubsMongoRepo } from '../repos/pubs/pubs.mongo.repo';
import { Router as createRouter } from 'express';
import createDebug from 'debug';

const debug = createDebug('W9Final:pubs:router');

export const pubsRouter = createRouter();
debug('Starting');

const repo = new PubsMongoRepo();
const controller = new PubsController(repo);

pubsRouter.post('/add', controller.create.bind(controller));
