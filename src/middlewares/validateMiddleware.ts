import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validate body, query, and params simultaneously
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign the safely parsed & structured data back to the request object
      req.body = parsed.body;
      req.query = parsed.query as Record<string, string | string[] | undefined>;
      req.params = parsed.params as Record<string, string>;

      next();
    } catch (error) {
      next(error);
    }
  };
};
