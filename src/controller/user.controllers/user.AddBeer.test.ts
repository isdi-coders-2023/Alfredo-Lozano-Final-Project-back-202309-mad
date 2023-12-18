import { Request, Response, NextFunction } from 'express';
import { UsersMongoRepo } from '../../repos/users/user.mongo.repo';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { UsersController } from './user.controller';
import { HttpError } from '../../types/http.error';
import { describe } from 'node:test';

const setupMockRequestResponse = (
  body: Record<string, any> = {},
  params: Record<string, any> = {}
): [Request, Response, NextFunction] => {
  const mockRequest: Request = { body, params } as unknown as Request;
  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext: NextFunction = jest.fn();
  return [mockRequest, mockResponse, mockNext];
};

describe('Given BeerController class', () => {
  describe('When we instantiate it without errors', () => {
    test('should successfully add a beer to a users tasted beers list', async () => {
      const mockRequest: Request = {
        body: { id: 'validUserID' },
        params: { id: 'validBeerID' },
      } as unknown as Request;
      const mockResponse: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext: NextFunction = jest.fn();
      const mockUser = { id: 'validUserID', probada: [] };
      const mockBeer = { id: 'validBeerID' };
      const mockUpdatedUser = { id: 'validUserID', probada: [mockBeer] };

      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        addBeer: jest.fn().mockResolvedValue(mockUpdatedUser),
      } as unknown as UsersMongoRepo;

      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;

      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;

      await controller.addBeer(mockRequest, mockResponse, mockNext);

      expect(mockUserRepo.getById).toHaveBeenCalledWith('validUserID');
      expect(mockBeerRepo.getById).toHaveBeenCalledWith('validBeerID');
      expect(mockUserRepo.addBeer).toHaveBeenCalledWith(
        mockBeer,
        'validUserID'
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    test('should successfully remove a beer from a user tasted beers list', async () => {
      // Arrange
      const mockRequest: Request = {
        body: { id: 'validUserID' },
        params: { id: 'validBeerID' },
      } as unknown as Request;
      const mockResponse: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const mockNext: NextFunction = jest.fn();
      const mockUser = { id: 'validUserID', probada: ['validBeerID'] };
      const mockBeer = { id: 'validBeerID' };
      const mockUpdatedUser = { id: 'validUserID', probada: [] };

      const mockUserRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        removeBeer: jest.fn().mockResolvedValue(mockUpdatedUser),
      } as unknown as UsersMongoRepo;

      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;

      const controller = new UsersController(mockUserRepo);
      controller.beerRepo = mockBeerRepo;
      await controller.removeBeer(mockRequest, mockResponse, mockNext);

      expect(mockUserRepo.getById).toHaveBeenCalledWith('validUserID');
      expect(mockBeerRepo.getById).toHaveBeenCalledWith('validBeerID');
      expect(mockUserRepo.removeBeer).toHaveBeenCalledWith(
        mockBeer,
        'validUserID'
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });
  });
  describe('When we instantiate it with errors', () => {
    test('should throw an error with status 404 if user is not found', async () => {
      // Arrange
      const [mockRequest, mockResponse, mockNext] = setupMockRequestResponse({
        id: 'invalidUserId',
      });
      const mockError = new HttpError(404, 'Not Found', 'User not found');
      const mockRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
      } as unknown as UsersMongoRepo;
      const controller = new UsersController(mockRepo);

      // Act
      await controller.addBeer(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockRepo.getById).toHaveBeenCalledWith('invalidUserId');
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining(mockError));
    });

    test('should throw an error with status 404 if user is not found', async () => {
      // Arrange
      const [mockRequest, mockResponse, mockNext] = setupMockRequestResponse(
        { id: 'InvalidUserID' },
        { id: 'InvalidBeerID' }
      );
      const mockError = new HttpError(404, 'Not Found', 'User not found');
      const mockRepo = {
        getById: jest.fn().mockRejectedValue(mockError),
      } as unknown as UsersMongoRepo;
      const controller = new UsersController(mockRepo);

      // Act
      await controller.removeBeer(mockRequest, mockResponse, mockNext);

      // Assert
      expect(mockRepo.getById).toHaveBeenCalledWith('InvalidUserID');
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining(mockError));
    });
  });
});
