import { registry } from './openapiRegistry.js';
import { UserSchema } from '../schemas/userSchema.js';

// Document: POST /api/users
registry.registerPath({
  method: 'post',
  path: '/api/users',
  summary: 'Register a new user',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserSchema.omit({ id: true }), // Reuse the base schema, omitting 'id'
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
});

// Document: GET /api/users/{id}
registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  summary: 'Get a user by ID',
  tags: ['Users'],
  request: {
    params: UserSchema.pick({ id: true }), // Automatically extracts data structure from the schema
  },
  responses: {
    200: {
      description: 'User details retrieved',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
});
