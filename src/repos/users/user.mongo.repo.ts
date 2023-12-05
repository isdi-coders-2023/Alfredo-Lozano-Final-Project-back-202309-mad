/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { UserRepository } from './users.repo';
import { User, UserLogin } from '../../entities/user.model';
import { UserModel } from './users.mongo.model';
import { HttpError } from '../../types/http.error';
import { Auth } from '../../services/auth';

const debug = createDebug('W9Final:Users:mongo:repo');

export class UsersMongoRepo implements UserRepository<User> {
  constructor() {
    debug('Instantiated');
  }

  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  getById(_id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  search({
    key,
    value,
  }: {
    key:
      | 'id'
      | 'name'
      | 'surname'
      | 'age'
      | 'userName'
      | 'probada'
      | keyof UserLogin;
    value: unknown;
  }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  create(_newItem: Omit<User, 'id'>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  update(_id: string, _updatedItem: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addBeer(_BeerId: string, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  addPub(_PubId: string, _userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  removeBeer(_id: string, _beerIdToRemove: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  removePub(_id: string, _pubIdToRemove: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async login(loginUser: UserLogin): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }
}
