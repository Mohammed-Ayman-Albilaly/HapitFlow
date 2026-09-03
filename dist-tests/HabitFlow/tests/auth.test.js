"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../backend/src/app"));
const setup_1 = require("./setup");
describe('Auth Endpoints', () => {
    const testUser = {
        email: 'test-qa@example.com',
        password: 'Password123!',
        name: 'QA User'
    };
    beforeEach(async () => {
        await setup_1.prisma.user.deleteMany({ where: { email: testUser.email } }).catch(() => { });
    });
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });
    it('should fail registration with existing email', async () => {
        await setup_1.prisma.user.create({ data: testUser });
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.status).toBe(400);
    });
    it('should login successfully', async () => {
        await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(testUser);
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
    it('should fail login with wrong password', async () => {
        await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(testUser);
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: testUser.email,
            password: 'WrongPassword'
        });
        expect(res.status).toBe(401);
    });
});
