"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../backend/src/app"));
const setup_1 = require("./setup");
describe('Habit CRUD Operations', () => {
    let token;
    let userId;
    beforeAll(async () => {
        const user = {
            email: 'habit-qa@example.com',
            password: 'Password123!',
            name: 'Habit QA'
        };
        await setup_1.prisma.user.deleteMany({ where: { email: user.email } }).catch(() => { });
        const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(user);
        const body = await res.json();
        token = body.token;
        const dbUser = await setup_1.prisma.user.findUnique({ where: { email: user.email } });
        userId = dbUser.id;
    });
    afterAll(async () => {
        await setup_1.prisma.habit.deleteMany({ where: { userId: userId } });
        await setup_1.prisma.user.delete({ where: { id: userId } });
    });
    it('should create a new habit', async () => {
        const habitData = {
            name: 'QA Habit',
            description: 'Test description',
            frequency: 'DAILY',
            goal: 1,
            category: 'QA'
        };
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/habits')
            .set('Authorization', `Bearer ${token}`)
            .send(habitData);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe(habitData.name);
    });
    it('should get all habits for the authenticated user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/habits')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('should update a habit', async () => {
        const habit = await setup_1.prisma.habit.findFirst({ where: { userId: userId } });
        if (!habit)
            return;
        const updateData = { name: 'Updated QA Habit' };
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/habits/${habit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(updateData.name);
    });
    it('should delete a habit', async () => {
        const habit = await setup_1.prisma.habit.findFirst({ where: { userId: userId } });
        if (!habit)
            return;
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/habits/${habit.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const check = await setup_1.prisma.habit.findUnique({ where: { id: habit.id } });
        expect(check).toBeNull();
    });
    it('should ensure data isolation between users', async () => {
        const otherUser = {
            email: 'other-qa@example.com',
            password: 'Password123!',
            name: 'Other QA'
        };
        await setup_1.prisma.user.deleteMany({ where: { email: otherUser.email } }).catch(() => { });
        const resReg = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(otherUser);
        const otherToken = (await resReg.json()).token;
        const myHabit = await setup_1.prisma.habit.create({
            data: {
                name: 'Private Habit',
                frequency: 'DAILY',
                goal: 1,
                category: 'Private',
                userId: userId
            }
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/habits')
            .set('Authorization', `Bearer ${otherToken}`);
        const habits = await res.json();
        expect(habits.find((h) => h.id === myHabit.id)).toBeUndefined();
    });
});
