import createDebug from 'debug';
import { UserRepository } from './users.repo';
import { User, UserLogin } from '../../entities/user.model';
import { UserModel } from './users.mongo.model';
import { HttpError } from '../../types/http.error';
import { Auth } from '../../services/auth';
import { Beer } from '../../entities/beer.model';

/* istanbul ignore next */
const debug = createDebug('W9Final:Users:mongo:repo');

export class UsersMongoRepo implements UserRepository<User> {
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
    const data = await UserModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findById',
      });
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
      .populate(
        'probadas',
        {
          beer: 0,
        },
        'visitado',
        {
          pubs: 0,
        }
      )
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

  async addBeer(beerId: Beer['id'], userId: User['id']): Promise<User> {
    try {
      const user = await UserModel.findById(userId).exec();
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (user.probada.includes(beerId as unknown as Beer)) {
        throw new HttpError(
          400,
          'Bad Request',
          "Beer already added to user's list"
        );
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { probada: beerId } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(
          500,
          'Internal Server Error',
          'Update not possible'
        );
      }

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new HttpError(500, 'Internal Server Error', 'Something went wrong');
    }
  }

  async removeBeer(
    beerIdToRemove: Beer['id'],
    userId: User['id']
  ): Promise<User> {
    try {
      const user = await UserModel.findById(userId).exec();

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!user.probada.includes(beerIdToRemove as unknown as Beer)) {
        return user;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { probada: beerIdToRemove } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new HttpError(500, 'Internal Server Error', 'Something went wrong');
    }
  }
}
