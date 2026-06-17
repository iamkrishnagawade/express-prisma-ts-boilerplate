import logger from '../lib/logger.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flags this as a expected app error

    Error.captureStackTrace(this, this.constructor);
    this.logError();
  }

  logError() {
    logger.error(`AppError: ${this.message}`);
    logger.error(`Stack: ${this.stack}`);
  }
}

export default AppError;
