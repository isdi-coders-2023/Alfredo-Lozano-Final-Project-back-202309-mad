import { User } from '../entities/user.model';

export type LoginResponse = {
  user: User;
  token: String;
};
