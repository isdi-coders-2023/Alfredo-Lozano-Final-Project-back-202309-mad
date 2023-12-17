// Import { Pubs } from '../../entities/pubs.model';
// import { Auth } from '../../services/auth';
// import { HttpError } from '../../types/http.error';
// import { PubsModel } from './pubs.mongo.model';
// import { PubsMongoRepo } from './pubs.mongo.repo';

// jest.mock('./pubs.mongo.model');
// jest.mock('../../services/auth');

// const mockPub = {
//   id: 'validID',
//   name: 'Pub 1',
//   direction: 'mock',
//   owner: 'John Doe',
//   beers: [],
// } as unknown as Pubs;

// describe('Given PubsMongoRepo class', () => {
//   let repo: PubsMongoRepo;
//   const exec = jest.fn().mockResolvedValue(mockPub);

//   describe('When we instantiate it without errors', () => {
//     beforeEach(() => {
//       repo = new PubsMongoRepo();
//       PubsModel.find = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       PubsModel.findById = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       PubsModel.create = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       PubsModel.findByIdAndDelete = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       Auth.compare = jest.fn().mockResolvedValue(true);
//     });

//     test('should return an array of Beer objects when the database has at least one Beer', async () => {
//       const result = await repo.getAll();
//       expect(result).toEqual(mockPub);
//     });
//     test('It should search', async () => {
//       const result = await repo.search({ key: 'name', value: true });
//       expect(exec).toHaveBeenCalled();
//       expect(result).toBe(mockPub);
//     });
//     test("should update a user's data when valid id and newData are provided", async () => {
//       const id = 'validId';
//       const newData: Partial<Pubs> = {
//         name: 'Pub 1',
//         direction: 'mock',
//         owner: 'John Doe',
//         beers: [],
//       };
//       const updatedUser: Pubs = {
//         id: 'validID',
//         name: 'Pub 1',
//         direction: 'mock',
//         owner: 'John Doe',
//         beers: [],
//       } as unknown as Pubs;
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         exec: jest.fn().mockResolvedValue(updatedUser),
//       });
//       const result = await repo.update(id, newData);
//       expect(result).toEqual(updatedUser);
//       expect(PubsModel.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, {
//         new: true,
//       });
//     });
//     test('should create a new beer item when given valid input', async () => {
//       const newItem: Omit<Pubs, 'id'> = {} as unknown as Pubs;
//       const expectedPub = {} as unknown as Pubs;
//       PubsModel.create = jest.fn().mockResolvedValue(expectedPub);
//       const result = await repo.create(newItem);
//       expect(result).toEqual(expectedPub);
//       expect(PubsModel.create).toHaveBeenCalledWith({ ...newItem });
//     });
//     test('should delete a pub with a valid id when given a valid id', async () => {
//       const id = 'validId';
//       const mockResult = { _id: id };
//       PubsModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockResult);
//       await repo.delete(id);
//       expect(PubsModel.findByIdAndDelete).toHaveBeenCalledWith(id);
//     });
//     test('should not add a beer to the "beers" list when the beer is already in the list', async () => {
//       const beerId = 'beerId';
//       const pubsId = 'pubsId';
//       const pubs = {
//         id: pubsId,
//         name: 'John',
//         surname: 'Doe',
//         age: 25,
//         userName: 'johndoe',
//         beers: [beerId],
//       };
//       const exec = pubsId;
//       PubsModel.findById = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ beerId }),
//         exec,
//       });

//       const result = await repo.addBeer(beerId, pubsId);

//       expect(PubsModel.findById).toHaveBeenCalledWith(pubsId);
//       expect(PubsModel.findByIdAndUpdate).not.toHaveBeenCalled();
//       expect(result).toEqual(pubs);
//     });
//     test("should remove a beer from a user's probadas list when the beer exists in the list", async () => {
//       const beerIdToRemove = 'beerId';
//       const pubsId = 'pubsId';
//       const pubs = {
//         id: pubsId,
//         name: 'John',
//         surname: 'Doe',
//         age: 25,
//         userName: 'johndoe',
//         beers: [beerIdToRemove],
//       };
//       const exec = pubsId;
//       PubsModel.findById = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         exec: jest.fn().mockResolvedValue(pubs),
//       });
//       const result = await repo.removeBeer(beerIdToRemove, pubsId);
//       expect(PubsModel.findById).toHaveBeenCalledWith(pubsId);
//       expect(PubsModel.findByIdAndUpdate).toHaveBeenCalledWith(
//         pubsId,
//         { $pull: { beers: beerIdToRemove } },
//         { new: true }
//       );
//       expect(result).toEqual(pubs);
//     });
//   });
//   describe('when there is an error', () => {
//     const mockExec = jest.fn().mockResolvedValueOnce(null);
//     beforeEach(() => {
//       repo = new PubsMongoRepo();
//       PubsModel.findById = jest.fn().mockResolvedValue(null);
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });
//       PubsModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
//         exec: mockExec,
//       });
//     });
//     test('should throw a HttpError with status code 404 when given an empty string as user id', async () => {
//       await expect(repo.getById('')).rejects.toThrow(HttpError);
//       expect(PubsModel.findById).toHaveBeenCalledWith('');
//     });
//     test('should throw an error when given an invalid id', async () => {
//       const id = 'invalidId';
//       const updatedItem: Partial<Pubs> = {
//         name: 'New Pub Name',
//       };
//       await expect(repo.update(id, updatedItem)).rejects.toThrow(HttpError);
//       expect(PubsModel.findByIdAndUpdate).toHaveBeenCalledWith(
//         id,
//         updatedItem,
//         {
//           new: true,
//         }
//       );
//     });
//     test('should throw a 404 HttpError when deleting a non-existing pub', async () => {
//       const id = 'nonExistingId';
//       PubsModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
//       await expect(repo.delete(id)).rejects.toThrow(HttpError);
//       expect(PubsModel.findByIdAndDelete).toHaveBeenCalledWith(id);
//     });
//     test('should throw an error if the pub is not found', async () => {
//       const beerId = 'beerId';
//       const pubId = 'pubId';
//       const exec = null;
//       PubsModel.findById = jest.fn().mockReturnValue({
//         populate: jest.fn().mockReturnValue({ exec }),
//         exec,
//       });
//       await expect(repo.addBeer(beerId, pubId)).rejects.toThrow(HttpError);
//       expect(PubsModel.findById).toHaveBeenCalledWith(pubId);
//     });
//     test('should throw a HttpError with status 404 when the update fails', async () => {
//       const beerId = 'beerId';
//       const pubsId = 'pubId';
//       const mockPub = {
//         id: pubsId,
//         name: 'John',
//         surname: 'Doe',
//         age: 25,
//         userName: 'johndoe',
//         beers: [],
//       };
//       PubsModel.findById = jest
//         .fn()
//         .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPub) });
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });
//       await expect(repo.addBeer(beerId, pubsId)).rejects.toThrow(HttpError);
//     });
//     test('should throw an error if the beerIdToRemove parameter is null or undefined', async () => {
//       const beerIdToRemove = '';
//       const pubId = 'pubId';
//       PubsModel.findById = jest
//         .fn()
//         .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
//       await expect(repo.removeBeer(beerIdToRemove, pubId)).rejects.toThrow(
//         HttpError
//       );
//     });
//     test('should not update the user object if the beer ID is not in the list', async () => {
//       const beerIdToRemove = 'beerId';
//       const pubsId = 'userId';
//       const mockPub = {
//         id: pubsId,
//         name: 'John',
//         surname: 'Doe',
//         age: 25,
//         userName: 'johndoe',
//         beers: [],
//       };
//       PubsModel.findById = jest
//         .fn()
//         .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPub) });

//       const result = await repo.removeBeer(beerIdToRemove, pubsId);
//       expect(PubsModel.findById).toHaveBeenCalledWith(pubsId);
//       expect(PubsModel.findByIdAndUpdate).not.toHaveBeenCalled();
//       expect(result).toEqual(mockPub);
//     });
//     test('should throw a HttpError with status 404 when the update fails', async () => {
//       const beerIdToRemove = 'beerId';
//       const pubsId = 'pubId';
//       const mockPub = {
//         id: pubsId,
//         name: 'John',
//         surname: 'Doe',
//         age: 25,
//         userName: 'johndoe',
//         beers: [beerIdToRemove],
//       };
//       PubsModel.findById = jest
//         .fn()
//         .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPub) });
//       PubsModel.findByIdAndUpdate = jest.fn().mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });
//       await expect(repo.removeBeer(beerIdToRemove, pubsId)).rejects.toThrow(
//         HttpError
//       );
//     });
//   });
// });
