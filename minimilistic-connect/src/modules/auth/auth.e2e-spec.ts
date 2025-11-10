import request from 'supertest';
import app from '@/app';
import { prisma } from '@/database';
import { authService } from './auth.service';

describe('Auth E2E Tests', () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.auditLog.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return 201', async () => {
      const uniqueEmail = `test.${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(uniqueEmail);
      expect(res.body.verified).toBe(false);

      // Check database
      const dbUser = await prisma.user.findUnique({
        where: { email: uniqueEmail },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.emailVerified).toBe(false);
      expect(dbUser!.passwordHash).toBeDefined();
    });

    it('should return 409 if email is already in use', async () => {
      const email = `test.conflict@example.com`;
      // Create user first
      await authService.signup({ email, password: 'password1' });
      
      // Attempt to sign up again
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: email,
          password: 'password2',
        });
        
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('AUTH_EMAIL_IN_USE');
    });
    
    it('should return 400 for invalid password (too short)', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'short.pass@example.com',
          password: '123',
        });
        
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });
  
  // ... Add tests for /login, /refresh, /me, etc.
});

