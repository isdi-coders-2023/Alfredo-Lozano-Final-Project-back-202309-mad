import { ImgData } from '../types/imgFiles';
import { User } from './user.model';

export type Beer = {
  id: string;
  name: string;
  brewer: string;
  style: string;
  alcohol: string;
  beerImg: ImgData;
  probada: boolean;
  autor: User;
};
