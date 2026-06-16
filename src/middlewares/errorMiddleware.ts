import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js';
import { env } from '../config/env.js';
import logger from '../lib/logger.js';

// Handles Prisma Errors
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      const fields = (err.meta?.target as string[])?.join(', ') || 'fields';
      return new AppError(
        `Duplicate field value entered for: ${fields}. Please use another value.`,
        409,
      );

    case 'P2025': // Record not found
      return new AppError(err.message || 'The requested record was not found.', 404);

    default:
      return new AppError(`Database error: ${err.message}`, 400);
  }
};

// Handles Zod Validation Errors
const handleZodError = (err: ZodError): AppError => {
  const errors = err.issues.map((e) => {
    const field = e.path.slice(1).join('.');
    return `${field || 'Field'}: ${e.message}`;
  });

  return new AppError(`Validation Failed: ${errors.join(' | ')}`, 400);
};

// Global Error Handling Middleware
export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message, stack: err.stack };

  // Intercept Prisma Errors and convert them into clean operational errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // Intercept Zod Errors and convert them into clean operational errors
  if (err instanceof ZodError) {
    error = handleZodError(err);
  }

  // Development Mode - Show Full Error Details
  if (env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  } else {
    // In Production, send only generic message
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      logger.error(`Uncaught Error: ${error.stack}`);
      // Programming or other unknown errors
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};
