import React from 'react';
import { Task } from '../types';
import { PlayIcon, TrashIcon, BellIcon } from '../constants';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (task: Task, isCompleted: boolean) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onStartPomodoro?: (task: Task) => void;
    subTasks?: Task[];
    getSubTasks?: (parentId: string) => Task[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStartPomodoro, onToggleComplete, onEdit, onDelete, subTasks, getSubTasks }) => {
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-500 dark:text-red-400';
            case 'high': return 'text-orange-500 dark:text-orange-400';
            case 'medium': return 'text-yellow-500 dark:text-yellow-400';
            case 'low': return 'text-green-500 dark:text-green-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-transparent dark:bg-gradient-to-r dark:from-cyan-500/5 dark:to-transparent p-3 rounded-lg border border-slate-200 dark:border-cyan-400/30 group hover:bg-slate-100 dark:hover:bg-cyan-500/10 dark:hover:border-cyan-400/50 transition-all duration-200 transform hover:scale-[1.02] dark:backdrop-blur-xl dark:shadow-[0_4px_20px_rgba(34,211,238,0.2)]">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => onToggleComplete(task, e.target.checked)}
                        className="h-5 w-5 rounded bg-slate-200 dark:bg-transparent dark:border-2 border-slate-300 dark:border-cyan-400 text-cyan-500 focus:ring-cyan-500 focus:ring-2 cursor-pointer flex-shrink-0 transition-all duration-300 hover:scale-110 dark:checked:bg-cyan-500 dark:checked:border-cyan-400 dark:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    />
                    <div className="flex-1 min-w-0">
                        <div
                            onClick={() => onEdit(task)}
                            className={`truncate cursor-pointer ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-white'}`}
                        >
                            {task.title}
                        </div>
                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {task.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2 py-0.5 bg-cyan-500/20 dark:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 rounded-full border border-cyan-300 dark:border-cyan-400/40"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {task.priority && task.priority !== 'medium' && (
                        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)} uppercase`}>
                            {task.priority === 'urgent' ? '🔥' : task.priority === 'high' ? '⚠️' : task.priority === 'low' ? '📋' : ''}
                        </span>
                    )}
                    {task.reminderMinutes && <BellIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400 dark:drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />}
                    <span className="text-xs text-slate-500 dark:text-cyan-300/90">{task.estimatedDuration} min</span>
                    {task.period === 'daily' && !task.completed && onStartPomodoro && (
                        <button onClick={() => onStartPomodoro(task)} className="p-1 rounded-full text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 transition-colors transform hover:scale-125 dark:border dark:border-cyan-500/30 dark:hover:border-cyan-500/50">
                            <PlayIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button onClick={() => onDelete(task.id)} className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 dark:hover:border-red-500/40 transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-125 dark:border dark:border-transparent">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {subTasks && subTasks.length > 0 && (
                <div className="pl-8 pt-2 mt-2 border-t border-slate-200 dark:border-cyan-500/30 space-y-2">
                    {subTasks.map(subTask => (
                        <TaskItem
                            key={subTask.id}
                            task={subTask}
                            onStartPomodoro={onStartPomodoro}
                            onToggleComplete={onToggleComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            subTasks={getSubTasks ? getSubTasks(subTask.id) : []}
                            getSubTasks={getSubTasks}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskItem;