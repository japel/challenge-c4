import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiError } from '../types/interfaces';

export default (err: ApiError, req: Request, res: Response, _next: NextFunction): void => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
};
