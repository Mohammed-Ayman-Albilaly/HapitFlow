import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup any global test state if needed
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
