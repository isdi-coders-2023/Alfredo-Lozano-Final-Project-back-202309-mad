import { Beer } from '../../entities/beer.model';
import { Pubs } from '../../entities/pubs.model.js';
import { HttpError } from '../../types/http.error.js';
import { PubsModel } from './pubs.mongo.model.js';
import { PubsRepository } from './pubs.repo.js';
import createDebug from 'debug';

const debug = createDebug('W9Final:Pubs:mongo:repo');

export class PubsMongoRepo implements PubsRepository<Pubs> {
  constructor() {
    debug('instantiated');
  }

  async create(newItem: Omit<Pubs, 'id'>): Promise<Pubs> {
    const result: Pubs = await PubsModel.create(newItem);
    return result;
  }

  async getAll(): Promise<Pubs[]> {
    const result = await PubsModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<Pubs> {
    const result = await PubsModel.findById(id);
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Get By Id not Possible');
    }

    return result;
  }

  async search({
    key,
    value,
  }: {
    key: keyof Pubs;
    value: any;
  }): Promise<Pubs[]> {
    const result = await PubsModel.find({ [key]: value })
      .populate('author', {
        user: 0,
      })
      .exec();

    return result;
  }

  async update(id: string, updatedItem: Partial<Pubs>): Promise<Pubs> {
    const result = await PubsModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not Possible');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await PubsModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not Possible');
    }
  }

  async addBeer(beerId: Beer['id'], pubId: Pubs['id']): Promise<Pubs> {
    console.log(beerId);
    console.log(pubId);
    const updatedPub = await PubsModel.findByIdAndUpdate(
      pubId,
      { $push: { beers: beerId } },
      {
        new: true,
      }
    ).exec();

    if (!updatedPub) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updatedPub;
  }

  async removeBeer(
    beerIdToRemove: Beer['id'],
    pubId: Pubs['id']
  ): Promise<Pubs> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await PubsModel.findById(pubId).exec();

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!user.beers.includes(beerIdToRemove as unknown as Beer)) {
        return user;
      }

      const updatedPub = await PubsModel.findByIdAndUpdate(
        pubId,
        { $pull: { beers: beerIdToRemove } },
        { new: true }
      ).exec();

      if (!updatedPub) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      return updatedPub;
    } catch (error) {
      throw error;
    }
  }
}
