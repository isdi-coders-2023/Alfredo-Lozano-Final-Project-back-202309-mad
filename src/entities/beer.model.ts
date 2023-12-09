import { ImgData } from '../types/imgFiles.js';
import { Pubs } from './pubs.model.js';
import { User } from './user.model.js';

export type Beer = {
  id: string;
  name: string;
  brewer: string;
  style: string;
  alcohol: string;
  beerImg: ImgData;
  probada?: boolean;
  author: User;
  pubs: Pubs;
};
