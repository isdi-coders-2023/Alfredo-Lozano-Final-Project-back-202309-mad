import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import createDebug from 'debug';
import { handleError } from './middleware/error.middleware.js';
import { usersRouter } from './routers/user.routes.js';
import { beersRouter } from './routers/beer.routes.js';
import { pubsRouter } from './routers/pub.routes.js';

const debug = createDebug('W9Final:app');
export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/user', usersRouter);
app.use('/beer', beersRouter);
app.use('/pubs', pubsRouter);

app.use(handleError);
