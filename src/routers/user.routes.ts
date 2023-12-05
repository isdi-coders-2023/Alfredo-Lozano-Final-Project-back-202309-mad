import { Router as createRouter } from 'express';
import createDebug from 'debug';

const debug = createDebug('W9Final:user:router');

export const usersRouter = createRouter();
debug('Starting');
