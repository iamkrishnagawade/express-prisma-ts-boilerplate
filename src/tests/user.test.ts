import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('User Endpoints Integration Tests', () => {
  // Clear out test records before running assertions to guarantee predictable isolation
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should successfully create a new user and return a structured 201 response', async () => {
      const payload = {
        email: 'testuser@example.com',
        name: 'Automation Test',
      };

      const res = await request(app).post('/api/users').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(payload.email);
    });

    it('should get intercepted by Zod validation and return a 400 error on invalid email format', async () => {
      const badPayload = {
        email: 'not-an-email',
        name: 'Bad Email Test',
      };

      const res = await request(app).post('/api/users').send(badPayload);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toContain('Validation Failed');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 when looking for a user ID that does not exist', async () => {
      const res = await request(app).get('/api/users/ed10dddf-bf33-4554-b6ef-07cb8c8e321b');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('fail');
    });

    it('should trigger our Express 5 param check and block a non-numeric string ID immediately', async () => {
      const res = await request(app).get('/api/users/abc');

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Validation Failed: id: Invalid UUID');
    });
  });
});
