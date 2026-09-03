"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHabitHistory = exports.completeHabit = void 0;
const db_1 = __importDefault(require("../config/db"));
const streakEngine_1 = require("../services/streakEngine");
const completeHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const habitId = Array.isArray(id) ? id[0] : id;
        const userId = req.user.userId;
        const habit = await db_1.default.habit.findFirst({
            where: { id: habitId, userId },
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        // Idempotency check
        const existing = await db_1.default.completion.findFirst({
            where: {
                habitId: habitId,
                completedAt: {
                    equals: today, // This depends on how Prisma handles Date objects
                },
            },
        });
        // Note: In a production app, we'd use a custom date format or a dedicated Date field
        // For this MVP, we'll use a simplified check:
        const completions = await db_1.default.completion.findMany({
            where: { habitId: habitId },
        });
        const alreadyCompleted = completions.some(c => c.completedAt.toISOString().split('T')[0] === todayStr);
        if (alreadyCompleted) {
            return res.status(400).json({ message: 'Habit already completed today' });
        }
        await db_1.default.completion.create({
            data: {
                habitId: habitId,
                userId: userId,
                completedAt: today,
            },
        });
        // Recalculate streak
        const allCompletions = await db_1.default.completion.findMany({
            where: { habitId: habitId },
            select: { completedAt: true },
        });
        const { currentStreak } = (0, streakEngine_1.calculateStreak)(allCompletions.map(c => c.completedAt), habit.frequency);
        res.status(200).json({ message: 'Habit completed!', currentStreak });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.completeHabit = completeHabit;
const getHabitHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const habitId = Array.isArray(id) ? id[0] : id;
        const userId = req.user.userId;
        const habit = await db_1.default.habit.findFirst({
            where: { id: habitId, userId },
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        const history = await db_1.default.completion.findMany({
            where: { habitId: habitId },
            orderBy: { completedAt: 'desc' },
        });
        res.status(200).json(history);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getHabitHistory = getHabitHistory;
