import { useReducer, useEffect, useMemo } from 'react';
import { Goal, Task } from '../types';

interface AppState {
    goal: Goal | null;
    tasks: Task[];
}

type Action =
    | { type: 'SET_GOAL'; payload: Goal }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; completed: boolean } }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_STATE'; payload: AppState };

const initialState: AppState = {
    goal: null,
    tasks: [],
};

const deleteTaskAndChildren = (tasks: Task[], taskId: string): Task[] => {
    const tasksToDelete = new Set<string>([taskId]);
    const queue = [taskId];

    while(queue.length > 0) {
        const currentParentId = queue.shift();
        const children = tasks.filter(task => task.parentId === currentParentId);
        for(const child of children) {
            tasksToDelete.add(child.id);
            queue.push(child.id);
        }
    }
    
    return tasks.filter(task => !tasksToDelete.has(task.id));
};

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_GOAL':
            return { ...state, goal: action.payload };
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case 'UPDATE_TASK_STATUS':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? { 
                        ...task, 
                        completed: action.payload.completed,
                        completedAt: action.payload.completed ? new Date().toISOString() : undefined
                    } : task
                ),
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: deleteTaskAndChildren(state.tasks, action.payload)
            };
        case 'SET_STATE':
            return action.payload;
        default:
            return state;
    }
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export const useTaskManager = () => {
    const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
        try {
            const storedState = localStorage.getItem('zenithFocusState');
            return storedState ? JSON.parse(storedState) : initial;
        } catch (error) {
            console.error("Could not parse stored state:", error);
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('zenithFocusState', JSON.stringify(state));
        } catch (error) {
            console.error("Could not save state:", error);
        }
    }, [state]);

    const progress = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = getStartOfWeek(now);
        const todayStr = now.toDateString();

        const calculateProgress = (tasks: Task[]) => {
            if (tasks.length === 0) return 0;
            const completed = tasks.filter(t => t.completed).length;
            return Math.round((completed / tasks.length) * 100);
        };

        const dailyTasks = state.tasks.filter(t => t.period === 'daily' && new Date(t.date).toDateString() === todayStr);
        const weeklyTasks = state.tasks.filter(t => t.period === 'weekly' && new Date(t.date) >= startOfWeek);
        const monthlyTasks = state.tasks.filter(t => t.period === 'monthly' && new Date(t.date) >= startOfMonth);
        
        const allTasks = state.tasks;

        return {
            daily: calculateProgress(dailyTasks),
            weekly: calculateProgress(weeklyTasks),
            monthly: calculateProgress(monthlyTasks),
            goal: calculateProgress(allTasks),
        };
    }, [state.tasks]);

    return { state, dispatch, progress };
};