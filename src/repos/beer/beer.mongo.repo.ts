import createDebug from 'debug';
import { Repository } from './beer.repo';
import { Beer } from '../../entities/beer.model';
import { BeerModel } from './beer.mongo.model';
import { HttpError } from '../../types/http.error';
import { UsersMongoRepo } from '../users/user.mongo.repo';

/* istanbul ignore next */
const debug = createDebug('W9Final:Beer:mongo:repo');

export class BeerMongoRepo implements Repository<Beer> {
  userRepo: UsersMongoRepo;
  constructor() {
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Beer[]> {
    const result = await BeerModel.find().exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<Beer> {
    const data = await BeerModel.findById(id).exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'Beer not found in file system', {
        cause: 'Trying findById',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof Beer;
    value: any;
  }): Promise<Beer[]> {
    const result = await BeerModel.find({ [key]: value })
      .populate('author', {
        user: 0,
      })
      .exec();

    return result;
  }

  async create(newItem: Omit<Beer, 'id'>): Promise<Beer> {
    const userID = newItem.author.id;
    await this.userRepo.getById(userID);
    const result: Beer = await BeerModel.create({
      ...newItem,
      autor: userID,
    });
    return result;
  }

  async update(id: string, updatedItem: Partial<Beer>): Promise<Beer> {
    const result = await BeerModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('User', { name: 1 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await BeerModel.findByIdAndDelete(id)
      .populate('author', {
        beer: 0,
      })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }
}
