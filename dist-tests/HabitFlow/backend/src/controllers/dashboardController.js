"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const habits = await db_1.default.habit.findMany({
            where: { userId },
        });
        const totalHabits = habits.length;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        const completionsToday = await db_1.default.completion.count({
            where: {
                userId,
                completedAt: {
                    gte: today,
                },
            },
        });
        // Weekly Bar Chart Data (Last 7 Days)
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setUTCHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            const count = await db_1.default.completion.count({
                where: {
                    userId,
                    completedAt: {
                        gte: date,
                        lt: new Date(date.getTime() + 86400000),
                    },
                },
            });
            weeklyData.push({ date: dateStr, count });
        }
        // Heatmap Data (Last 365 Days)
        // For performance, we'll fetch all completions and group them in memory
        const allCompletions = await db_1.default.completion.findMany({
            where: { userId },
            select: { completedAt: true },
        });
        const heatmapMap = {};
        allCompletions.forEach(c => {
            const dateStr = c.completedAt.toISOString().split('T')[0];
            heatmapMap[dateStr] = (heatmapMap[dateStr] || 0) + 1;
        });
        res.status(200).json({
            stats: {
                totalHabits,
                completedToday: completionsToday,
            },
            weeklyData,
            heatmapData: heatmapMap,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDashboardData = getDashboardData;
