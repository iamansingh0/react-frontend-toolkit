import { Habit } from '../store/habit-slice.ts'
export const getStreak = (habit: Habit) => {
    let streak = 0;
    const currentDate = new Date();

    // Sort completedDates in descending order (newest first)
    const sortedDates = [...habit.completedDates].sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    if (habit.frequency === "daily") {
        // For daily habits: check consecutive days
        while (true) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (habit.completedDates.includes(dateString)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
    } else if (habit.frequency === "weekly") {
        // For weekly habits: check consecutive weeks
        const weekMap = new Map<number, boolean>();

        // Create a map of completed weeks
        sortedDates.forEach(dateStr => {
            const date = new Date(dateStr);
            const yearWeek = getYearWeek(date);
            weekMap.set(yearWeek, true);
        });

        // Check consecutive weeks
        let currentWeek = getYearWeek(currentDate);
        while (weekMap.has(currentWeek)) {
            streak++;
            // Move to previous week
            currentDate.setDate(currentDate.getDate() - 7);
            currentWeek = getYearWeek(currentDate);
        }
    }
    return streak;
}

// Helper function to get a unique identifier for a week in a year
const getYearWeek = (date: Date): number => {
    const tempDate = new Date(date.getTime());
    const firstDayOfYear = new Date(tempDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (tempDate.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

    // Create a unique identifier for the week in this year
    return tempDate.getFullYear() * 100 + weekNumber;
};

// Function to check if a habit was completed in a specific week
export const wasWeekCompleted = (habit: Habit, weekStartDate: Date): boolean => {
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        if (habit.completedDates.includes(dateStr)) {
            return true;
        }
    }
    return false;
};

// Function to format week display
export const formatWeekDisplay = (weekStartDate: Date): string => {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    const startMonth = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEndDate.toLocaleDateString('en-US', { month: 'short' });

    const startDay = weekStartDate.getDate();
    const endDay = weekEndDate.getDate();

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
};

// Helper function to get week number
export const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};