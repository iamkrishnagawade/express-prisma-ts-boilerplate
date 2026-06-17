import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Parse and validate the incoming request parts via Zod
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 2. Use Object.defineProperty to safely override Express 5's read-only getters
      Object.defineProperty(req, 'body', {
        value: parsed.body,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      Object.defineProperty(req, 'query', {
        value: parsed.query,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      Object.defineProperty(req, 'params', {
        value: parsed.params,
        writable: true,
        configurable: true,
        enumerable: true,
      });

      next();
    } catch (error) {
      next(error); // Passes ZodError down to your global error handler
    }
  };
};
