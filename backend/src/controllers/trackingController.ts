import { Request, Response } from 'express';
import prisma from '../config/db';
import { calculateStreak } from '../services/streakEngine';

export const completeHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Idempotency check
    const existing = await prisma.completion.findFirst({
      where: {
        habitId: id,
        completedAt: {
          equals: today, // This depends on how Prisma handles Date objects
        },
      },
    });

    // Note: In a production app, we'd use a custom date format or a dedicated Date field
    // For this MVP, we'll use a simplified check:
    const completions = await prisma.completion.findMany({
      where: { habitId: id },
    });
    
    const alreadyCompleted = completions.some(c => 
      c.completedAt.toISOString().split('T')[0] === todayStr
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    await prisma.completion.create({
      data: {
        habitId: id,
        userId: userId,
        completedAt: today,
      },
    });

    // Recalculate streak
    const allCompletions = await prisma.completion.findMany({
      where: { habitId: id },
      select: { completedAt: true },
    });

    const { currentStreak } = calculateStreak(
      allCompletions.map(c => c.completedAt),
      habit.frequency
    );

    res.status(200).json({ message: 'Habit completed!', currentStreak });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHabitHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const habit = await prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const history = await prisma.completion.findMany({
      where: { habitId: id },
      orderBy: { completedAt: 'desc' },
    });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
