"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streakEngine_1 = require("../backend/src/services/streakEngine");
describe('Streak Calculation Logic', () => {
    const DAILY = 'DAILY';
    const WEEKLY = 'WEEKLY';
    it('should return 0 for no completions', () => {
        const result = (0, streakEngine_1.calculateStreak)([], DAILY);
        expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
    });
    it('should calculate a current streak of 1 for today', () => {
        const today = new Date();
        const completions = [today];
        const result = (0, streakEngine_1.calculateStreak)(completions, DAILY);
        expect(result.currentStreak).toBe(1);
    });
    it('should calculate a current streak of 2 for today and yesterday', () => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const completions = [today, yesterday];
        const result = (0, streakEngine_1.calculateStreak)(completions, DAILY);
        expect(result.currentStreak).toBe(2);
    });
    it('should reset current streak if yesterday was missed', () => {
        const today = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const completions = [today, threeDaysAgo];
        const result = (0, streakEngine_1.calculateStreak)(completions, DAILY);
        expect(result.currentStreak).toBe(1);
    });
    it('should calculate the longest streak correctly', () => {
        const dates = [];
        // Streak 1: 3 days
        const d1 = new Date();
        d1.setDate(d1.getDate() - 10);
        dates.push(new Date(d1));
        const d2 = new Date();
        d2.setDate(d2.getDate() - 9);
        dates.push(new Date(d2));
        const d3 = new Date();
        d3.setDate(d3.getDate() - 8);
        dates.push(new Date(d3));
        // Gap
        // Streak 2: 5 days
        const d4 = new Date();
        d4.setDate(d4.getDate() - 5);
        dates.push(new Date(d4));
        const d5 = new Date();
        d5.setDate(d5.getDate() - 4);
        dates.push(new Date(d5));
        const d6 = new Date();
        d6.setDate(d6.getDate() - 3);
        dates.push(new Date(d6));
        const d7 = new Date();
        d7.setDate(d7.getDate() - 2);
        dates.push(new Date(d7));
        const d8 = new Date();
        d8.setDate(d8.getDate() - 1);
        dates.push(new Date(d8));
        const result = (0, streakEngine_1.calculateStreak)(dates, DAILY);
        expect(result.longestStreak).toBe(5);
    });
    it('should handle weekly frequency (simplified)', () => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const completions = [today, lastWeek];
        const result = (0, streakEngine_1.calculateStreak)(completions, WEEKLY);
        expect(result.currentStreak).toBeGreaterThanOrEqual(2);
    });
});
