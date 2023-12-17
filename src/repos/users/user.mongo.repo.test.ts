import { Beer } from '../../entities/beer.model.js';
import { User, UserLogin } from '../../entities/user.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';
import { UsersMongoRepo } from './user.mongo.repo.js';
import { UserModel } from './users.mongo.model.js';

jest.mock('./users.mongo.model');
jest.mock('../../services/auth');
jest.mock('../beer/beer.mongo.model');
describe('Given UserMongoRepo class', () => {
  let repo: UsersMongoRepo;
  const exec = jest.fn().mockResolvedValue('name');

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      repo = new UsersMongoRepo();
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.create = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockReturnValue({ exec }) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });
      Auth.compare = jest.fn().mockResolvedValue(true);
    });
    const id = 'validId';
    const user: User = {
      id: 'validId',
      name: 'John',
      surname: 'Doe',
      age: 25,
      userName: 'johndoe',
      probada: [],
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    test('should return a user object when a valid id is passed', async () => {
      const repo = new UsersMongoRepo();
      const exec = jest.fn().mockResolvedValue(user);
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.getById(id);
      expect(UserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
    test("should update a user's data when valid id and newData are provided", async () => {
      const id = 'validId';
      const newData: Partial<User> = {
        name: 'New Name',
        age: 30,
      };
      const updatedUser: User = {
        id: 'validId',
        name: 'New Name',
        age: 30,
      } as unknown as User;
      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedUser) });
      const result = await repo.update(id, newData);

      expect(result).toEqual(updatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, {
        new: true,
      });
    });
    test('should return an array of users when there are users in the database', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John',
          surname: 'Doe',
          age: 25,
          userName: 'johndoe',
          visitado: [],
          probada: [],
        },
        {
          id: '2',
          name: 'Jane',
          surname: 'Smith',
          age: 30,
          userName: 'janesmith',
          visitado: [],
          probada: [],
        },
      ];
      const exec = jest.fn().mockResolvedValue(mockUsers);
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const repo = new UsersMongoRepo();
      const result = await repo.getAll();
      expect(result).toEqual(mockUsers);
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });
    test('should return a user object when valid credentials are provided', async () => {
      const loginUser: UserLogin = {
        email: 'test@example.com',
        password: 'password123',
      };
      UserModel.findOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      const result = await repo.login(loginUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: loginUser.email,
      });
      expect(Auth.compare).toHaveBeenCalledWith(
        loginUser.password,
        user.password
      );
      expect(result).toEqual(user);
    });
    test('It should search', async () => {
      const result = await repo.search({ key: 'name', value: true });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('name');
    });
    test('should create a new user with valid input data', async () => {
      const newItem: Omit<User, 'id'> = {
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        probada: [],
        email: 'john.doe@example.com',
        password: 'hashedPassword',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser: User = {
        id: 'validId',
        ...newItem,
      };
      Auth.hash = jest.fn().mockResolvedValue(hashedPassword);
      UserModel.create = jest.fn().mockResolvedValue(createdUser);
      const result = await repo.create(newItem);

      expect(Auth.hash).toHaveBeenCalledWith(newItem.password);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...newItem,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
    test('shoul return an add beer and update objet', async () => {
      const beer = { id: 'beerId', name: 'Beer' } as unknown as Beer;
      const userId = '1';
      const updatedUser = {
        ...beer.author,
        probada: [beer],
      };
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });
      const result = await repo.addBeer(beer, userId);
      expect(result).toEqual(updatedUser);
    });
    test('should return the updated user object when valid user ID and beer are provided', async () => {
      const userId = 'validUserId';
      const beer = { id: 'beerId', name: 'Beer' } as unknown as Beer;
      const updatedUser = { id: userId, probada: [] };
      UserModel.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedUser) });
      const result = await repo.removeBeer(userId, beer);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('when there is an error', () => {
    beforeEach(() => {
      const exec = jest.fn().mockResolvedValue(null);
      repo = new UsersMongoRepo();
      UserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      UserModel.findOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    });
    test('should throw a HttpError with status code 404 when given an empty string as user id', async () => {
      await expect(repo.getById('')).rejects.toThrow(HttpError);
      expect(UserModel.findById).toHaveBeenCalledWith('');
    });
    test('should throw an HttpError with status 404 and message', async () => {
      await expect(repo.getAll()).rejects.toThrow(HttpError);
      await expect(repo.getAll()).rejects.toThrow('getAll method not possible');
    });
    test('should throw an HttpError with status 404 when an invalid id is passed', async () => {
      const repo = new UsersMongoRepo();
      const id = 'invalidId';
      await expect(repo.getById(id)).rejects.toThrow(HttpError);
      expect(UserModel.findById).toHaveBeenCalledWith(id);
    });
    test('Then, when data isnt found with the update() method', () => {
      expect(repo.update('', {})).rejects.toThrow();
    });

    test('Then, when data isnt found with the delete() method', () => {
      expect(repo.delete('')).rejects.toThrow();
    });
    test("Then, when data isn't found with the update() method", async () => {
      await expect(repo.update('', {})).rejects.toThrow(HttpError);
    });

    test("Then, when data isn't found with the delete() method", async () => {
      await expect(repo.delete('')).rejects.toThrow(HttpError);
    });

    test('should throw a 404 error if the user is not found in the database', async () => {
      const beerId = {} as unknown as Beer;
      const userId = 'userId';
      await expect(repo.addBeer(beerId, userId)).rejects.toThrow(HttpError);
    });

    test('should throw a HttpError with status 404 when the user does not exist', async () => {
      const beerIdToRemove = {} as unknown as Beer;
      const userId = 'userId';
      await expect(repo.removeBeer(userId, beerIdToRemove)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw a HttpError with status 404 when the update fails', async () => {
      const beerIdToRemove = {} as unknown as Beer;
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        probada: [beerIdToRemove],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repo.removeBeer(userId, beerIdToRemove)).rejects.toThrow(
        HttpError
      );
    });
    test('should throw HttpError with 401 status when invalid email is provided', async () => {
      const loginUser: UserLogin = {
        email: 'invalid@example.com',
        password: 'password123',
      };
      await expect(repo.login(loginUser)).rejects.toThrow(HttpError);
    });
    test('should not update the user object if the beer ID is not in the list', async () => {
      const beerIdToadd = {} as unknown as Beer;
      const userId = 'userId';
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        age: 25,
        userName: 'johndoe',
        probada: [],
      };
      UserModel.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });

      const error = new HttpError(404, 'Not found', 'Update not possible');
      await expect(repo.addBeer(beerIdToadd, userId)).rejects.toThrow(error);
    });
  });
});
