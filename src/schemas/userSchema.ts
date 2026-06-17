import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../docs/openapiRegistry.js';

extendZodWithOpenApi(z);

export const UserSchema = registry.register(
  'User',
  z.object({
    id: z.uuid().openapi({ example: 'ed10dddf-bf33-4554-b6ef-07cb8c8e321c' }),
    email: z.email().openapi({ example: 'bob@example.com' }),
    name: z.string().min(2).optional().openapi({ example: 'Bob' }),
  }),
);

// Schema for matching standard numeric database IDs in URL params
export const userIdParamSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

// Schema for Creating a User
export const createUserSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address format'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
  }),
});

// Schema for Updating a User
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid numeric string'),
  }),
  body: z
    .object({
      email: z.email('Invalid email address format').optional(),
      name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    })
    .refine((data) => data.email !== undefined || data.name !== undefined, {
      message: 'You must provide at least one field to update (email or name)',
    }),
});
