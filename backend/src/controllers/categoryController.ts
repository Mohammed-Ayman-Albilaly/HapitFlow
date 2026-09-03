import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const userId = (req as any).user.userId;

    if (!name || !color) {
      return res.status(400).json({ message: 'Name and color are required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
