import { Task, UserStats } from '../types';

export const calculateUserStats = (tasks: Task[]): UserStats => {
    const completedTasks = tasks.filter(t => t.completed);
    const totalTasksCompleted = completedTasks.length;

    // Calculate streak
    const sortedCompletions = completedTasks
        .filter(t => t.completedAt)
        .map(t => new Date(t.completedAt!))
        .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const completionDate of sortedCompletions) {
        const date = new Date(completionDate);
        date.setHours(0, 0, 0, 0);

        if (!lastDate) {
            // First completion
            const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 0 || daysDiff === 1) {
                tempStreak = 1;
                currentStreak = 1;
            }
            lastDate = date;
            continue;
        }

        const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            // Consecutive day
            tempStreak++;
            if (currentStreak > 0) currentStreak++;
        } else if (daysDiff > 1) {
            // Streak broken
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            currentStreak = 0;
        }

        lastDate = date;
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return {
        totalTasksCompleted,
        currentStreak,
        longestStreak,
        lastCompletionDate: sortedCompletions[0]?.toISOString(),
        totalPomodoroSessions: 0, // Can be calculated from Pomodoro sessions in future
    };
};

export const getProductivityInsights = (tasks: Task[]): string[] => {
    const insights: string[] = [];
    const completedTasks = tasks.filter(t => t.completed);
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
        return ['Start by creating your first task!'];
    }

    const completionRate = (completedTasks.length / totalTasks) * 100;

    if (completionRate === 100) {
        insights.push('🎉 Perfect! All tasks completed!');
    } else if (completionRate >= 80) {
        insights.push('🌟 Excellent progress! Keep it up!');
    } else if (completionRate >= 50) {
        insights.push('👍 Good progress! You\'re halfway there!');
    } else if (completionRate > 0) {
        insights.push('💪 Keep going! Every task completed counts!');
    }

    // Check for high priority tasks
    const urgentTasks = tasks.filter(t => !t.completed && t.priority === 'urgent');
    if (urgentTasks.length > 0) {
        insights.push(`⚡ ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's' : ''} need${urgentTasks.length === 1 ? 's' : ''} attention!`);
    }

    // Check for overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.date) < now);
    if (overdueTasks.length > 0) {
        insights.push(`⏰ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`);
    }

    return insights;
};
