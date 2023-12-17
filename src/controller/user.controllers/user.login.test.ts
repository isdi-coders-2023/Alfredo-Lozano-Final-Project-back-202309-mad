import { Request, Response } from 'express';
import { UsersController } from './user.controller.js';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo.js';
import { User } from '../../entities/user.model.js';

jest.mock('../../services/auth');

describe('UsersController', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  let mockRepo: jest.Mocked<UsersMongoRepo>;
  let controller: UsersController;

  beforeAll(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });
  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn().mockResolvedValue([{}]),
      getById: jest.fn().mockResolvedValue({}),
      search: jest.fn().mockResolvedValue([{}]),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      addBeer: jest.fn().mockResolvedValue({ id: '1', probada: ['beer1'] }),
      delete: jest.fn().mockResolvedValue(undefined),
      login: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<UsersMongoRepo>;

    controller = new UsersController(mockRepo);
  });

  describe('login method', () => {
    test('should return user data and token for a valid user', async () => {
      const mockRequestWithUserId = {
        body: { userId: 'someUserId' },
        params: {},
        query: { key: 'value' },
      } as unknown as Request;

      const mockResponseWithUserId = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      await controller.login(
        mockRequestWithUserId,
        mockResponseWithUserId,
        mockNext
      );

      expect(mockResponseWithUserId.json).toHaveBeenCalled();
    });

    test('should successfully authenticate with valid credentials and return user data and token', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as unknown as Request;
      const mockUser = { email: 'pepe', password: 'abcd' } as unknown as User;
      mockRepo.login.mockResolvedValueOnce(mockUser);
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });
  describe('other methods', () => {
    test('should handle errors during login', async () => {
      const mockError = new Error('Mock error');
      mockRepo.login.mockRejectedValueOnce(mockError);

      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('should handle errors during addBeer', async () => {
      const mockRequest = {
        body: { id: 'userId' },
        params: { id: 'beerId' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      const mockError = new Error('Mock error');
      const mockRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
      } as unknown as jest.Mocked<UsersMongoRepo>;
      const controller = new UsersController(mockRepo);

      await controller.addBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalledWith('userId');
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
