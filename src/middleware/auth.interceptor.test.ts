import { NextFunction, Request, Response } from 'express';
import { Interceptor } from './auth.interceptor';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error';
import { describe } from 'node:test';
import { UsersMongoRepo } from '../repos/users/user.mongo.repo';

jest.mock('../services/auth', () => ({
  Auth: {
    verifyAndGetPayload: jest.fn().mockResolvedValue('someId'),
  },
}));

describe('Given the middleware', () => {
  describe('When it is instantiated', () => {
    const req = {
      get: jest.fn().mockReturnValueOnce('Bearer token'),
      body: {},
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction & jest.Mock;
    const interceptor = new Interceptor();

    test('should successfully extract and verify token', () => {
      (Auth.verifyAndGetPayload as jest.Mock).mockReturnValueOnce({
        id: 'someId',
      });

      interceptor.authorization(req, res, next);

      expect(req.body.id).toBe('someId');
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When it is instantiated', () => {
    const req = {
      body: {
        id: 'user1',
      },
      params: {
        id: 'user1',
      },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const interceptor = new Interceptor();
    test('should call next middleware function when user IDs match', async () => {
      await interceptor.authentication(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated with ERROR', () => {
    describe('it should throw..', () => {
      const req = {
        body: {},
        params: {
          id: 'user1',
        },
      } as unknown as Request;
      const res = {} as unknown as Response;
      const next = jest.fn() as NextFunction;
      const interceptor = new Interceptor();
      test('should throw a CastError when user ID is undefined', async () => {
        await interceptor.authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
    });
    describe('should throw an HttpError', () => {
      const req = {
        get: jest.fn().mockReturnValueOnce(undefined),
        body: {},
      } as unknown as Request;
      const res = {} as unknown as Response;
      const next = jest.fn() as NextFunction & jest.Mock;
      const interceptor = new Interceptor();

      test('with status code 401 and message "Unauthorized" when Authorization header is missing', () => {
        interceptor.authorization(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
        const error = next.mock.calls[0][0];
        expect(error.status).toBe(401);
        expect(error.message).toBe('');
        expect(next).toHaveBeenCalledTimes(1);
      });

      test('with status code 401 and message "Unauthorized" when user IDs do not match', () => {
        UsersMongoRepo.prototype.getById = jest
          .fn()
          .mockResolvedValue({ id: 'user2' });
        const req = {
          body: {
            id: 'user1',
          },
          params: {
            id: 'user2',
          },
        } as unknown as Request;

        interceptor.authentication(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
        const error = next.mock.calls[0][0];
        expect(error.status).toBe(401);
        expect(error.message).toBe('');
      });
      test('should throw an error if the user ID is missing', async () => {
        const req = {
          body: {},
          params: {
            id: 'validUserID',
          },
        } as unknown as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;
        const interceptor = new Interceptor();
        await interceptor.authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
      });
    });
  });
});
