export interface Goal {
    id: string;
    title: string;
    endDate: string;
    createdAt?: string;
}

export type TaskPeriod = 'monthly' | 'weekly' | 'daily';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    title: string;
    period: TaskPeriod;
    parentId?: string;
    date: string; // ISO string
    estimatedDuration: number; // in minutes
    breakDuration?: number; // in minutes
    completed: boolean;
    completedAt?: string; // ISO string
    reminderMinutes?: number; // Minutes before due date to send notification
    priority?: TaskPriority;
    tags?: string[];
    description?: string;
}

export interface UserStats {
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate?: string;
    totalPomodoroSessions: number;
}