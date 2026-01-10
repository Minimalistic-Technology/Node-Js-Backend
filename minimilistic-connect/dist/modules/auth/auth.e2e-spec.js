"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const database_1 = require("@/database");
const auth_service_1 = require("./auth.service");
describe('Auth E2E Tests', () => {
    // Clean up the database before each test
    beforeEach(async () => {
        await database_1.prisma.user.deleteMany();
        await database_1.prisma.refreshToken.deleteMany();
        await database_1.prisma.emailVerificationToken.deleteMany();
        await database_1.prisma.auditLog.deleteMany();
    });
    afterAll(async () => {
        await database_1.prisma.$disconnect();
    });
    describe('POST /api/auth/signup', () => {
        it('should create a new user and return 201', async () => {
            const uniqueEmail = `test.${Date.now()}@example.com`;
            const res = await (0, supertest_1.default)(app_1.default)
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
            const dbUser = await database_1.prisma.user.findUnique({
                where: { email: uniqueEmail },
            });
            expect(dbUser).not.toBeNull();
            expect(dbUser.emailVerified).toBe(false);
            expect(dbUser.passwordHash).toBeDefined();
        });
        it('should return 409 if email is already in use', async () => {
            const email = `test.conflict@example.com`;
            // Create user first
            await auth_service_1.authService.signup({ email, password: 'password1' });
            // Attempt to sign up again
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/signup')
                .send({
                email: email,
                password: 'password2',
            });
            expect(res.status).toBe(409);
            expect(res.body.error).toBe('AUTH_EMAIL_IN_USE');
        });
        it('should return 400 for invalid password (too short)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
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
