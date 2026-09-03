import request from 'supertest';
import app from '../backend/src/app';
import { prisma } from './setup';

describe('Habit CRUD Operations', () => {
  let token: string;
  let userId: string;
  let categoryId: string;

  beforeAll(async () => {
    const user = {
      email: 'habit-qa@example.com',
      password: 'Password123!',
    };
    
    await prisma.user.deleteMany({ where: { email: user.email } }).catch(() => {});
    const res = await request(app).post('/api/auth/register').send(user);
    token = res.body.token;
    
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    userId = dbUser!.id;

    // Create a category required for habit creation
    const category = await prisma.category.create({
      data: {
        name: 'QA Category',
        color: '#FFFFFF',
        userId: userId
      }
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.habit.deleteMany({ where: { userId: userId } });
    await prisma.category.deleteMany({ where: { userId: userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it('should create a new habit', async () => {
    const habitData = {
      title: 'QA Habit',
      description: 'Test description',
      frequency: 'DAILY',
      categoryId: categoryId
    };

    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send(habitData);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(habitData.title);
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

    const updateData = { title: 'Updated QA Habit' };
    const res = await request(app)
      .patch(`/api/habits/${habit.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updateData.title);
  });

  it('should delete a habit', async () => {
    const habit = await prisma.habit.findFirst({ where: { userId: userId } });
    if (!habit) return;

    const res = await request(app)
      .delete(`/api/habits/${habit.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
    
    const check = await prisma.habit.findUnique({ where: { id: habit.id } });
    expect(check).toBeNull();
  });

  it('should ensure data isolation between users', async () => {
    const otherUser = {
      email: 'other-qa@example.com',
      password: 'Password123!',
    };
    await prisma.user.deleteMany({ where: { email: otherUser.email } }).catch(() => {});
    const resReg = await request(app).post('/api/auth/register').send(otherUser);
    const otherToken = resReg.body.token;

    // Create a habit using the API for the main user
    const habitRes = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Private Habit',
        frequency: 'DAILY',
        categoryId: categoryId
      });
    
    const myHabit = habitRes.body;

    // Fetch habits as the other user
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${otherToken}`);
    
    const habits = res.body;
    expect(habits.find((h: any) => h.id === myHabit.id)).toBeUndefined();
  });
});
