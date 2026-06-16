import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError";

import { Prisma } from "../generated/prisma/client";
import { env } from "../config/env";

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      const fields = (err.meta?.target as string[])?.join(', ') || 'fields';
      return new AppError(`Duplicate field value entered for: ${fields}. Please use another value.`, 409);
    
    case 'P2025': // Record not found
      return new AppError(err.message || 'The requested record was not found.', 404);
      
    default:
      return new AppError(`Database error: ${err.message}`, 400);
  }
};

export const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  let error = {...err, message: err.message, stack: err.stack};
  
  // Intercept Prisma Errors and convert them into clean operational errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }
  
  if (env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    })
  } else {
    // in production, send only generic message
    if(error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown errors
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      })
    }
  }
}