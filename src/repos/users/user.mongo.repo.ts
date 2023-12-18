import createDebug from 'debug';
import { UserRepository } from './users.repo.js';
import { User, UserLogin } from '../../entities/user.model.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';
import { Beer } from '../../entities/beer.model.js';

/* istanbul ignore next */
const debug = createDebug('W9Final:Users:mongo:repo');

export class UsersMongoRepo implements UserRepository<User, Beer> {
  constructor() {
    debug('Instantiated');
  }

  async login(loginUser: UserLogin): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().populate('probada').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).populate('probada').exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findById',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('probada', {
        beer: 0,
      })
      .exec();

    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Fail to delete',
      });
  }

  async addBeer(beer: Beer, userId: User['id']): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { probada: beer } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(
        404,
        'Not Found in mongo repo',
        'Update not possible'
      );
    }

    return updatedUser;
  }

  async removeBeer(userId: User['id'], beer: Beer): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { probada: beer.id } },
      { new: true }
    ).exec();
    console.log('ver si ha pasado', updatedUser);
    if (!updatedUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updatedUser;
  }
}
