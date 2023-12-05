import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { beerRouter } from './router/beer.router.js';
import createDebug from 'debug';
import { handleError } from './middleware/error.middleware.js';
import { pubsRouter } from './router/pubs.router.js';
import { usersRouter } from './router/user.router.js';

const debug = createDebug('W9Final:app');
export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/beer', beerRouter);
app.use('/pubs', pubsRouter);
app.use('/user', usersRouter);

app.use(handleError);
