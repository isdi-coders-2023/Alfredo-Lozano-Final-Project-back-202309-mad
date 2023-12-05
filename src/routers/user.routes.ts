import { Router as createRouter } from 'express';
import createDebug from 'debug';

/* istanbul ignore next */
const debug = createDebug('W9Final:user:router');

export const usersRouter = createRouter();
debug('Starting');
