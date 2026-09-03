import request from 'supertest';
import app from '../backend/src/app';
import { prisma } from './setup';

describe('Auth Endpoints', () => {
  const testUser = {
    email: 'test-qa@example.com',
    password: 'Password123!',
  };

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } }).catch(() => {});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail registration with existing email', async () => {
    await prisma.user.create({
      data: {
        email: "test-qa@example.com",
        password: "Password123!"
      }
    });
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(400);
  });

  it('should login successfully', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword'
      });
    
    expect(res.status).toBe(401);
  });
});
