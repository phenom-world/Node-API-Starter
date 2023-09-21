import { Handler, NextFunction, Response } from 'express';
import { AuthRequest } from '../interface';
import ErrorMiddleware from '../middlewares/error';
import Exception from './error';

export default function asyncHandler(handler: Handler): Handler {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res, next);
    } catch (error: Exception | Error | any) {
      ErrorMiddleware.errorHandler(error, req, res, next);
    }
  };
}
