"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStreak = void 0;
const calculateStreak = (completions, frequency) => {
    if (completions.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }
    // Sort completions descending (most recent first)
    const sortedDates = completions
        .map(d => d.toISOString().split('T')[0])
        .sort((a, b) => b.localeCompare(a));
    const uniqueDates = [...new Set(sortedDates)];
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    if (frequency === 'DAILY') {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        // Check if streak is still alive (completed today or yesterday)
        const lastDate = uniqueDates[0];
        if (lastDate !== today && lastDate !== yesterdayStr) {
            currentStreak = 0;
        }
        else {
            // Calculate current streak
            let checkDate = new Date(lastDate);
            let i = 0;
            while (i < uniqueDates.length) {
                const dateStr = checkDate.toISOString().split('T')[0];
                if (uniqueDates.includes(dateStr)) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                    i++;
                }
                else {
                    break;
                }
            }
        }
        // Calculate longest streak
        let maxStreak = 0;
        let currentMax = 0;
        const allDatesSortedAsc = [...uniqueDates].sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < allDatesSortedAsc.length; i++) {
            if (i === 0) {
                currentMax = 1;
            }
            else {
                const prev = new Date(allDatesSortedAsc[i - 1]);
                prev.setDate(prev.getDate() + 1);
                if (prev.toISOString().split('T')[0] === allDatesSortedAsc[i]) {
                    currentMax++;
                }
                else {
                    maxStreak = Math.max(maxStreak, currentMax);
                    currentMax = 1;
                }
            }
        }
        longestStreak = Math.max(maxStreak, currentMax);
    }
    else if (frequency === 'WEEKLY') {
        // Weekly logic: completed at least once per calendar week
        const getWeekYear = (dateStr) => {
            const date = new Date(dateStr);
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
            return `${date.getFullYear()}-W${Math.ceil((days + startOfYear.getDay() + 1) / 7)}`;
        };
        const weeks = uniqueDates.map(getWeekYear).sort((a, b) => b.localeCompare(a));
        const uniqueWeeks = [...new Set(weeks)];
        // Current streak: consecutive weeks from now backwards
        const currentWeek = getWeekYear(new Date().toISOString().split('T')[0]);
        let weekIdx = 0;
        let checkWeek = currentWeek;
        // This is a simplified weekly streak check
        // In a real app, we'd need a robust ISO week helper
        currentStreak = uniqueWeeks.length; // Simplified for MVP: total unique weeks completed
        longestStreak = uniqueWeeks.length;
    }
    return { currentStreak, longestStreak };
};
exports.calculateStreak = calculateStreak;
