import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { BeersControler } from './beer.controller';
import { Request, Response, NextFunction } from 'express';

describe('Given FilmsController class', () => {
  let controller: BeersControler;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<BeerMongoRepo>;

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
      getById: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      login: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<BeerMongoRepo>;

    controller = new BeersControler(mockRepo);
  });

  describe('When we instantiate it without errors', () => {
    test('Then register (create) should create a new user with valid input data and image file', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as BeerMongoRepo;

      const controller = new BeersControler(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };

      controller.cloudinaryService = mockCloudinaryService;

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.beerImg).toBe(mockImageData);
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid multer file');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
      } as unknown as BeerMongoRepo;

      controller = new BeersControler(mockRepo);
    });
    test('Then register (create) should throw an error', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
