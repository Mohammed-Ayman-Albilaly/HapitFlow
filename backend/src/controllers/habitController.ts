import { Request, Response } from 'express';
import prisma from '../config/db';

export const getHabits = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createHabit = async (req: Request, res: Response) => {
  try {
    const { title, description, categoryId, frequency } = req.body;
    const userId = (req as any).user.userId;

    if (!title || !categoryId) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        categoryId,
        frequency,
        userId,
      },
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, frequency } = req.body;
    const userId = (req as any).user.userId;

    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        frequency,
      },
    });
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await prisma.habit.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
