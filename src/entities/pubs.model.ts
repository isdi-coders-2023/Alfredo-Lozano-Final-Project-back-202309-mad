import { Beer } from './beer.model';

export type Pubs = {
  id: string;
  name: string;
  direction: string;
  owner: string;
  Beers: Beer[];
  visitado: Boolean;
};
