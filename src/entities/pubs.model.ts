import { Beer } from './beer.model.js';

export type Pubs = {
  id: string;
  name: string;
  direction: string;
  owner: string;
  Beers: Beer[];
};
