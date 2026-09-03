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
  } catch (error: any) {
    console.error('[HabitController.getHabits] Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createHabit = async (req: Request, res: Response) => {
  try {
    const { title, description, categoryId, frequency } = req.body;
    const userId = (req as any).user.userId;

    if (!title || !categoryId) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    // Ensure the category belongs to the user before associating it with a habit
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return res.status(400).json({ message: 'Invalid category or category does not belong to the user' });
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
  } catch (error: any) {
    console.error('[HabitController.createHabit] Error:', error);
    res.status(400).json({ 
      message: 'Failed to create habit', 
      error: error.message || 'An unexpected error occurred' 
    });
  }
};

export const updateHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const habitId = Array.isArray(id) ? id[0] : id;
    const { title, description, categoryId, frequency } = req.body;
    const userId = (req as any).user.userId;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      if (!category) {
        return res.status(400).json({ message: 'Invalid category or category does not belong to the user' });
      }
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        title,
        description,
        categoryId,
        frequency,
      },
    });
    res.status(200).json(updatedHabit);
  } catch (error: any) {
    console.error('[HabitController.updateHabit] Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const habitId = Array.isArray(id) ? id[0] : id;
    const userId = (req as any).user.userId;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('[HabitController.deleteHabit] Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
