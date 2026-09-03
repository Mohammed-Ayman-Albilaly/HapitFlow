import request from 'supertest';
import app from '../backend/src/app';
import { prisma } from './setup';

describe('Habit CRUD Operations', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = {
      email: 'habit-qa@example.com',
      password: 'Password123!',
      name: 'Habit QA'
    };
    
    await prisma.user.deleteMany({ where: { email: user.email } }).catch(() => {});
    const res = await request(app).post('/api/auth/register').send(user);
    const body = await res.json();
    token = body.token;
    
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    userId = dbUser!.id;
  });

  afterAll(async () => {
    await prisma.habit.deleteMany({ where: { userId: userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it('should create a new habit', async () => {
    const habitData = {
      name: 'QA Habit',
      description: 'Test description',
      frequency: 'DAILY',
      goal: 1,
      category: 'QA'
    };

    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send(habitData);
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(habitData.name);
  });

  it('should get all habits for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a habit', async () => {
    const habit = await prisma.habit.findFirst({ where: { userId: userId } });
    if (!habit) return;

    const updateData = { name: 'Updated QA Habit' };
    const res = await request(app)
      .patch(`/api/habits/${habit.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updateData.name);
  });

  it('should delete a habit', async () => {
    const habit = await prisma.habit.findFirst({ where: { userId: userId } });
    if (!habit) return;

    const res = await request(app)
      .delete(`/api/habits/${habit.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    
    const check = await prisma.habit.findUnique({ where: { id: habit.id } });
    expect(check).toBeNull();
  });

  it('should ensure data isolation between users', async () => {
    const otherUser = {
      email: 'other-qa@example.com',
      password: 'Password123!',
      name: 'Other QA'
    };
    await prisma.user.deleteMany({ where: { email: otherUser.email } }).catch(() => {});
    const resReg = await request(app).post('/api/auth/register').send(otherUser);
    const otherToken = (await resReg.json()).token;

    const myHabit = await prisma.habit.create({
      data: {
        name: 'Private Habit',
        frequency: 'DAILY',
        goal: 1,
        category: 'Private',
        userId: userId
      }
    });

    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${otherToken}`);
    
    const habits = await res.json();
    expect(habits.find((h: any) => h.id === myHabit.id)).toBeUndefined();
  });
});
