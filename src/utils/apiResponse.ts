import { Response } from 'express';

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
      status: 'success',
      message,
      ...(resultsCount !== undefined && { results: resultsCount }),
      ...(data !== undefined && { data }),
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

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static delete<T>(res: Response, data?: T, message?: string): void {
    this.send({ res, statusCode: 200, message, data });
  }

  static update<T>(res: Response, data?: T, message?: string): void {
    this.send({ res, statusCode: 200, message, data });
  }

  static notFound(res: Response): void {
    this.send({ res, statusCode: 404, message: 'Not Found' });
  }

  static unauthorized(res: Response): void {
    this.send({ res, statusCode: 401, message: 'Unauthorized' });
  }

  static forbidden(res: Response): void {
    this.send({ res, statusCode: 403, message: 'Forbidden' });
  }

  static serverError(res: Response): void {
    this.send({ res, statusCode: 500, message: 'Internal Server Error' });
  }
}
