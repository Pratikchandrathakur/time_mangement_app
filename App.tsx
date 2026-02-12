
import React, { useState, useEffect, useMemo } from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { getRandomAffirmation } from './utils/affirmations';
import { Goal, Task, TaskPeriod } from './types';
import Header from './components/Header';
import GoalSetupModal from './components/modals/GoalSetupModal';
import TaskModal from './components/modals/TaskModal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import PomodoroTimer from './components/PomodoroTimer';
import CircularProgressBar from './components/CircularProgressBar';
import TaskItem from './components/TaskItem';
import SearchFilter from './components/SearchFilter';
import ShortcutsHelp from './components/ShortcutsHelp';
import StatsDashboard from './components/StatsDashboard';
import { PlusIcon } from './constants';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { exportData, exportToCSV } from './utils/dataExport';
import { calculateUserStats, getProductivityInsights } from './utils/statsCalculator';

const App: React.FC = () => {
    const { state, dispatch, progress } = useTaskManager();
    const [affirmation, setAffirmation] = useState<{ text: string; author: string } | null>(null);
    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [taskModalData, setTaskModalData] = useState<{ period: TaskPeriod; parentId?: string } | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [pomodoroTask, setPomodoroTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isShortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Calculate user stats
    const userStats = useMemo(() => calculateUserStats(state.tasks), [state.tasks]);
    const insights = useMemo(() => getProductivityInsights(state.tasks), [state.tasks]);

    // Keyboard shortcuts
    useKeyboardShortcuts([
        {
            key: 'n',
            ctrl: true,
            description: 'Create new task',
            action: () => openTaskModal('daily'),
        },
        {
            key: 'k',
            ctrl: true,
            description: 'Open search',
            action: () => setSearchOpen(true),
        },
        {
            key: '?',
            shift: true,
            description: 'Show shortcuts',
            action: () => setShortcutsHelpOpen(true),
        },
        {
            key: 'e',
            ctrl: true,
            shift: true,
            description: 'Export data',
            action: () => exportData(state.goal, state.tasks),
        },
        {
            key: 'Escape',
            description: 'Close modal',
            action: () => {
                setSearchOpen(false);
                setShortcutsHelpOpen(false);
                if (isTaskModalOpen) closeTaskModal();
            },
        },
    ], !isTaskModalOpen && !isGoalModalOpen && !taskToDelete);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Check for task reminders periodically
    useEffect(() => {
        const checkReminders = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            state.tasks.forEach(task => {
                if (task.reminderMinutes && !task.completed) {
                    const taskDate = new Date(task.date);
                    const reminderTime = new Date(taskDate.getTime() - task.reminderMinutes * 60000);

                    // Check if the reminder time is in the past minute
                    if (now >= reminderTime && now < new Date(reminderTime.getTime() + 60000)) {
                         new Notification('Task Reminder', {
                            body: `It's time to start: "${task.title}"`,
                            icon: '/vite.svg', // Optional: Add an icon
                        });
                    }
                }
            });
        };
        
        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [state.tasks]);


    useEffect(() => {
        if (!state.goal) {
            setGoalModalOpen(true);
        } else {
            setGoalModalOpen(false);
        }
    }, [state.goal]);

    useEffect(() => {
        setAffirmation(getRandomAffirmation());
    }, []);
    
    const openTaskModal = (period: TaskPeriod, parentId?: string) => {
        setTaskModalData({ period, parentId });
        setEditingTask(null);
        setTaskModalOpen(true);
    };

    const openEditTaskModal = (task: Task) => {
        setTaskModalData({ period: task.period, parentId: task.parentId });
        setEditingTask(task);
        setTaskModalOpen(true);
    };
    
    const closeTaskModal = () => {
        setTaskModalOpen(false);
        setEditingTask(null);
        setTaskModalData(null);
    };

    const handleSaveTask = (task: Task) => {
        if (editingTask) {
            dispatch({ type: 'UPDATE_TASK', payload: task });
        } else {
            dispatch({ type: 'ADD_TASK', payload: task });
        }
        closeTaskModal();
    };

    const handleTaskCompletion = (task: Task, isCompleted: boolean) => {
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id: task.id, completed: isCompleted } });
        if (pomodoroTask && pomodoroTask.id === task.id) {
            setPomodoroTask(null);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        setTaskToDelete(taskId);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            dispatch({ type: 'DELETE_TASK', payload: taskToDelete });
            setTaskToDelete(null);
        }
    };

    const getTasksByParent = (parentId: string) => state.tasks.filter(t => t.parentId === parentId);
    
    const monthlyTasks = useMemo(() => state.tasks.filter(t => t.period === 'monthly'), [state.tasks]);
    const weeklyTasks = useMemo(() => state.tasks.filter(t => t.period === 'weekly'), [state.tasks]);
    const dailyTasks = useMemo(() => state.tasks.filter(t => t.period === 'daily' && new Date(t.date).toDateString() === new Date().toDateString()), [state.tasks]);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-black">
            <Header />
            <main className="flex-grow p-4 sm:p-6 space-y-6">
                {state.goal ? (
                    <>
                        <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 text-center shadow-lg border border-slate-200 dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-purple-500/10 dark:border-cyan-400/40 dark:shadow-[0_0_50px_rgba(34,211,238,0.3)] dark:backdrop-blur-3xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400 dark:drop-shadow-[0_0_15px_rgba(34,211,238,1)] mb-2">{state.goal.title}</h2>
                                    <p className="text-slate-500 dark:text-cyan-200/90 text-sm sm:text-base">Target: {new Date(state.goal.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSearchOpen(true)}
                                        className="p-2 rounded-lg bg-slate-200 dark:bg-cyan-500/20 hover:bg-slate-300 dark:hover:bg-cyan-500/30 text-slate-700 dark:text-cyan-300 transition-colors border dark:border-cyan-400/30"
                                        title="Search & Filter (Ctrl+K)"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => exportData(state.goal, state.tasks)}
                                        className="p-2 rounded-lg bg-slate-200 dark:bg-cyan-500/20 hover:bg-slate-300 dark:hover:bg-cyan-500/30 text-slate-700 dark:text-cyan-300 transition-colors border dark:border-cyan-400/30"
                                        title="Export Data (Ctrl+Shift+E)"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setShortcutsHelpOpen(true)}
                                        className="p-2 rounded-lg bg-slate-200 dark:bg-cyan-500/20 hover:bg-slate-300 dark:hover:bg-cyan-500/30 text-slate-700 dark:text-cyan-300 transition-colors border dark:border-cyan-400/30"
                                        title="Keyboard Shortcuts (?)"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 7h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {affirmation && (
                                <blockquote className="mt-4">
                                    <p className="text-lg italic text-slate-700 dark:text-white">"{affirmation.text}"</p>
                                    <cite className="block text-right mt-2 text-sm text-cyan-600 dark:text-cyan-300 font-medium">- {affirmation.author}</cite>
                                </blockquote>
                            )}
                        </div>

                        <StatsDashboard stats={userStats} insights={insights} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <CircularProgressBar percentage={progress.goal} label="Goal" />
                            <CircularProgressBar percentage={progress.monthly} label="Monthly" />
                            <CircularProgressBar percentage={progress.weekly} label="Weekly" />
                            <CircularProgressBar percentage={progress.daily} label="Daily" />
                        </div>
                        
                        <div className="space-y-4">
                           <TaskSection title="Daily Tasks" tasks={dailyTasks} period="daily" onStartPomodoro={setPomodoroTask} onTaskCompletion={handleTaskCompletion} onAddTask={() => openTaskModal('daily')} onEditTask={openEditTaskModal} onDeleteTask={handleDeleteTask} />
                           <TaskSection title="Weekly Tasks" tasks={weeklyTasks} period="weekly" onTaskCompletion={handleTaskCompletion} onAddTask={() => openTaskModal('weekly')} onEditTask={openEditTaskModal} getSubTasks={getTasksByParent} onDeleteTask={handleDeleteTask} />
                           <TaskSection title="Monthly Tasks" tasks={monthlyTasks} period="monthly" onTaskCompletion={handleTaskCompletion} onAddTask={() => openTaskModal('monthly')} onEditTask={openEditTaskModal} getSubTasks={getTasksByParent} onDeleteTask={handleDeleteTask} />
                        </div>
                    </>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full pt-20">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to Zenith Focus</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Set a goal to begin your journey.</p>
                        <button onClick={() => setGoalModalOpen(true)} className="mt-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/30">
                            Set Your Ultimate Goal
                        </button>
                    </div>
                )}
            </main>

            {isGoalModalOpen && (
                <GoalSetupModal
                    onClose={() => state.goal && setGoalModalOpen(false)}
                    onSave={(goal: Goal) => {
                        dispatch({ type: 'SET_GOAL', payload: goal });
                        setGoalModalOpen(false);
                    }}
                />
            )}
            
            {isTaskModalOpen && taskModalData && (
                 <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={closeTaskModal}
                    onSave={handleSaveTask}
                    period={taskModalData.period}
                    parentId={taskModalData.parentId}
                    taskToEdit={editingTask}
                />
            )}

            <ConfirmationModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={confirmDeleteTask}
                title="Confirm Deletion"
                message="This will delete the task and all its sub-tasks. This action cannot be undone."
            />

            {isSearchOpen && (
                <SearchFilter
                    tasks={state.tasks}
                    onFilteredTasksChange={(filtered) => {
                        setFilteredTasks(filtered);
                        setIsFilterActive(filtered.length !== state.tasks.length);
                    }}
                    onClose={() => setSearchOpen(false)}
                />
            )}

            {isShortcutsHelpOpen && (
                <ShortcutsHelp onClose={() => setShortcutsHelpOpen(false)} />
            )}

            {pomodoroTask && (
                <PomodoroTimer
                    task={pomodoroTask}
                    onComplete={(isCompleted) => handleTaskCompletion(pomodoroTask, isCompleted)}
                    onStop={() => setPomodoroTask(null)}
                    startMinimized
                />
            )}
        </div>
    );
};


interface TaskSectionProps {
    title: string;
    tasks: Task[];
    period: TaskPeriod;
    onTaskCompletion: (task: Task, isCompleted: boolean) => void;
    onAddTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onStartPomodoro?: (task: Task) => void;
    getSubTasks?: (parentId: string) => Task[];
}

const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, period, onTaskCompletion, onAddTask, onEditTask, onDeleteTask, onStartPomodoro, getSubTasks }) => {
    const [isExpanded, setIsExpanded] = useState(period === 'daily');

    return (
        <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-4 shadow-lg border border-slate-200 dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/5 dark:to-purple-500/5 dark:border-cyan-400/40 dark:shadow-[0_0_50px_rgba(34,211,238,0.2)] dark:backdrop-blur-3xl">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-cyan-300 dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{title}</h3>
                <div className="flex items-center space-x-2">
                     <button onClick={(e) => { e.stopPropagation(); onAddTask(); }} className="p-1 rounded-full text-slate-500 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-cyan-500/20 hover:text-slate-800 dark:hover:text-cyan-300 transition-colors dark:border dark:border-cyan-500/20 dark:hover:border-cyan-500/40">
                        <PlusIcon />
                     </button>
                    <svg className={`w-6 h-6 text-slate-500 dark:text-cyan-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 space-y-2">
                    {tasks.length > 0 ? tasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onStartPomodoro={onStartPomodoro} 
                            onToggleComplete={onTaskCompletion}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            subTasks={getSubTasks ? getSubTasks(task.id) : []}
                            getSubTasks={getSubTasks}
                        />
                    )) : <p className="text-slate-500 dark:text-cyan-400/60 text-sm text-center py-2">No {period} tasks yet. Add one!</p>}
                </div>
            )}
        </div>
    );
};

export default App;
