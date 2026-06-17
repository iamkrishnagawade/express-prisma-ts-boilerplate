import { Response } from 'express';
import logger from '../lib/logger.js';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

export class ApiResponse {
  /**
   * Sends a standardized successful JSON response.
   */
  static send<T>({
    res,
    statusCode = 200,
    message = 'Operation successful',
    data,
  }: ApiResponseOptions<T>): void {
    // Auto-calculate results count if data is an array
    const resultsCount = Array.isArray(data) ? data.length : undefined;

    res.status(statusCode).json({
      status: `${statusCode}`.startsWith('4') ? 'fail' : 'success',
      message,
      ...(resultsCount !== undefined && { results: resultsCount }),
      ...(data !== undefined && { data }),
    });

    logger.info('API Response', {
      requestId: res.locals.requestId,
      statusCode,
      message,
      results: resultsCount,
      data,
    });
  }

  // Common shortcut methods for cleaner controller syntax
  static success<T>(res: Response, data?: T, message?: string): void {
    this.send({ res, statusCode: 200, message, data });
  }

  static error(res: Response, message: string): void {
    this.send({ res, statusCode: 400, message });
  }

  static created<T>(res: Response, data?: T, message?: string): void {
    this.send({ res, statusCode: 201, message, data });
  }

  static noContent(res: Response, message?: string): void {
    this.send({ res, statusCode: 204, message: message || 'No Content' });
  }

  static notFound(res: Response, message?: string): void {
    this.send({ res, statusCode: 404, message: message || 'Not Found' });
  }

  static unauthorized(res: Response, message?: string): void {
    this.send({ res, statusCode: 401, message: message || 'Unauthorized' });
  }

  static forbidden(res: Response, message?: string): void {
    this.send({ res, statusCode: 403, message: message || 'Forbidden' });
  }

  static serverError(res: Response, message?: string): void {
    this.send({ res, statusCode: 500, message: message || 'Internal Server Error' });
  }
}
