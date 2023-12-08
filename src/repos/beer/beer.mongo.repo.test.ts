import { Beer } from '../../entities/beer.model';
import { Auth } from '../../services/auth';
import { HttpError } from '../../types/http.error';
import { BeerModel } from './beer.mongo.model';
import { BeerMongoRepo } from './beer.mongo.repo';

jest.mock('./beer.mongo.model');
jest.mock('../../services/auth');
const beers = {
  name: 'Updated Beer',
  author: 'validUserID',
} as unknown as Beer;
describe('Given UserMongoRepo class', () => {
  let repo: BeerMongoRepo;
  const exec = jest.fn().mockResolvedValue(beers);

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new BeerMongoRepo();
      BeerModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
        exec,
      });
      BeerModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
        exec,
      });
      BeerModel.create = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
        exec,
      });
      BeerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
        exec,
      });
      BeerModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
        exec,
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
    });

    test('should return an array of Beer objects when the database has at least one Beer', async () => {
      const result = await repo.getAll();
      expect(result).toEqual(beers);
    });
    test('should return a Beer object when given a valid id', async () => {
      const { id } = beers;
      const result = await repo.getById(id);
      expect(result).toEqual(beers);
      expect(BeerModel.findById).toHaveBeenCalledWith(id);
    });
    test('It should search', async () => {
      const result = await repo.search({ key: 'name', value: true });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe(beers);
    });
    test('should create a new beer item when given valid input', async () => {
      const newItem: Omit<Beer, 'id'> = {
        name: 'New Beer',
        brewer: 'Brewer',
        style: 'Style',
        alcohol: '5%',
        beerImg: {},
        probada: true,
        author: { id: 'validUserID', name: 'Author' },
      } as unknown as Beer;
      const expectedBeer: Beer = {
        id: 'validID',
        name: 'New Beer',
        brewer: 'Brewer',
        style: 'Style',
        alcohol: '5%',
        beerImg: {},
        probada: true,
        author: { id: 'validUserID', name: 'Author' },
      } as unknown as Beer;
      repo.userRepo.getById = jest.fn().mockResolvedValue({
        id: 'validUserID',
      });
      BeerModel.create = jest.fn().mockResolvedValue(expectedBeer);

      const result = await repo.create(newItem);

      expect(result).toEqual(expectedBeer);
      expect(repo.userRepo.getById).toHaveBeenCalledWith('validUserID');
      expect(BeerModel.create).toHaveBeenCalledWith({
        ...newItem,
        autor: 'validUserID',
      });
    });
    test('should update a beer with valid id and updatedItem', async () => {
      const id = 'validId';
      const updatedItem = {
        name: 'Updated Beer',
      };
      const expectedBeer = {
        author: 'validUserID',
        name: 'Updated Beer',
      };

      const result = await repo.update(id, updatedItem);
      expect(result).toEqual(expectedBeer);
      expect(BeerModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updatedItem,
        {
          new: true,
        }
      );
    });
    test('should not delete any beer when id is null or undefined', async () => {
      repo.userRepo.getById = jest.fn().mockResolvedValue({
        id: '',
      });
      const id = '';
      const result = await repo.delete(id);
      expect(result).toBeUndefined();
    });
  });
  describe('When we instantiate it with errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      repo = new BeerMongoRepo();
      BeerModel.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      BeerModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      BeerModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue(exec),
        exec,
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
    });
    test('should throw an HttpError with status 404 and message', async () => {
      await expect(repo.getAll()).rejects.toThrow(HttpError);
      await expect(repo.getAll()).rejects.toThrow('getAll method not possible');
    });
    test('should throw a HttpError with status code 404 when given an empty string as user id', async () => {
      await expect(repo.getById('')).rejects.toThrow(HttpError);
      expect(BeerModel.findById).toHaveBeenCalledWith('');
    });
    test('should throw an HttpError with status 404 when an invalid id is passed', async () => {
      const id = 'invalidId';
      await expect(repo.getById(id)).rejects.toThrow(HttpError);
      expect(BeerModel.findById).toHaveBeenCalledWith(id);
    });
    test('should throw an HttpError with status 404 when an invalid id is passed', async () => {
      const id = 'valid id';
      await expect(repo.delete(id)).rejects.toThrow(HttpError);
      expect(BeerModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
