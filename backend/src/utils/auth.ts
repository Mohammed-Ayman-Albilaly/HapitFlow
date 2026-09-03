import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION as any 
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
