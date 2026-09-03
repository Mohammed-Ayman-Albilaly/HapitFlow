"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
beforeAll(async () => {
    // Setup any global test state if needed
});
afterAll(async () => {
    await prisma.$disconnect();
});
