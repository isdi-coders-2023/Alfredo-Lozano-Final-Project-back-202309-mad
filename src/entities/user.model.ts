import { Beer } from './beer.model.js';

export type UserLogin = {
  password: string;
  email: string;
};

export type User = UserLogin & {
  id: string;
  name: string;
  surname: string;
  age: number;
  userName: string;
  probada: Beer[];
};
