"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHabit = exports.updateHabit = exports.createHabit = exports.getHabits = void 0;
const db_1 = __importDefault(require("../config/db"));
const getHabits = async (req, res) => {
    try {
        const userId = req.user.userId;
        const habits = await db_1.default.habit.findMany({
            where: { userId },
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(habits);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getHabits = getHabits;
const createHabit = async (req, res) => {
    try {
        const { title, description, categoryId, frequency } = req.body;
        const userId = req.user.userId;
        if (!title || !categoryId) {
            return res.status(400).json({ message: 'Title and category are required' });
        }
        const habit = await db_1.default.habit.create({
            data: {
                title,
                description,
                categoryId,
                frequency,
                userId,
            },
        });
        res.status(201).json(habit);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createHabit = createHabit;
const updateHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const habitId = Array.isArray(id) ? id[0] : id;
        const { title, description, categoryId, frequency } = req.body;
        const userId = req.user.userId;
        const habit = await db_1.default.habit.findFirst({
            where: { id: habitId, userId },
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        const updatedHabit = await db_1.default.habit.update({
            where: { id: habitId },
            data: {
                title,
                description,
                categoryId,
                frequency,
            },
        });
        res.status(200).json(updatedHabit);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateHabit = updateHabit;
const deleteHabit = async (req, res) => {
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
        await db_1.default.habit.delete({
            where: { id: habitId },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteHabit = deleteHabit;
