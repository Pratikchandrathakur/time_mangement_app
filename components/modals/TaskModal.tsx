import React, { useState, useEffect } from 'react';
import { Task, TaskPeriod, TaskPriority } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    period: TaskPeriod;
    parentId?: string;
    taskToEdit?: Task | null;
}

const reminderOptions = [
    { value: 0, label: 'No Reminder' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
];

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, period, parentId, taskToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reminderMinutes, setReminderMinutes] = useState<number>(0);
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [tags, setTags] = useState<string>('');
    const { theme } = useTheme();

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setEstimatedDuration(taskToEdit.estimatedDuration);
            setBreakDuration(taskToEdit.breakDuration || 5);
            setDate(new Date(taskToEdit.date).toISOString().split('T')[0]);
            setReminderMinutes(taskToEdit.reminderMinutes || 0);
            setPriority(taskToEdit.priority || 'medium');
            setTags((taskToEdit.tags || []).join(', '));
        } else {
            // Reset form for new task
            setTitle('');
            setDescription('');
            setEstimatedDuration(25);
            setBreakDuration(5);
            setDate(new Date().toISOString().split('T')[0]);
            setReminderMinutes(0);
            setPriority('medium');
            setTags('');
        }
    }, [taskToEdit, isOpen]);

    const handleSave = () => {
        if (title) {
            const taskTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
            const taskData = {
                title,
                description,
                estimatedDuration: estimatedDuration || 0,
                breakDuration: breakDuration > 0 ? breakDuration : undefined,
                date: new Date(date).toISOString(),
                reminderMinutes: reminderMinutes > 0 ? reminderMinutes : undefined,
                priority,
                tags: taskTags.length > 0 ? taskTags : undefined,
            };

            if (taskToEdit) {
                onSave({
                    ...taskToEdit,
                    ...taskData,
                });
            } else {
                onSave({
                    id: `task-${Date.now()}`,
                    period,
                    parentId,
                    completed: false,
                    ...taskData,
                });
            }
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <div className="bg-white/80 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-cyan-500/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] dark:shadow-cyan-500/20 animate-scale-in">
                <h2 className="text-2xl font-bold mb-4 capitalize text-slate-800 dark:text-cyan-300">{taskToEdit ? 'Edit' : 'Add'} {period} Task</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`e.g., Chapter 1 of ${period} plan`}
                            className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:placeholder-cyan-400/40 dark:backdrop-blur-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add task details..."
                            rows={2}
                            className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:placeholder-cyan-400/40 dark:backdrop-blur-xl resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Focus (min)</label>
                             <input
                                type="number"
                                value={estimatedDuration}
                                onChange={(e) => setEstimatedDuration(parseInt(e.target.value, 10) || 0)}
                                className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Break (min)</label>
                             <input
                                type="number"
                                value={breakDuration}
                                onChange={(e) => setBreakDuration(parseInt(e.target.value, 10) || 0)}
                                className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                             />
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Date</label>
                             <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                                style={{ colorScheme: theme }}
                             />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., work, important, urgent"
                            className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:placeholder-cyan-400/40 dark:backdrop-blur-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Reminder</label>
                        <select
                            value={reminderMinutes}
                            onChange={(e) => setReminderMinutes(parseInt(e.target.value, 10))}
                             className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                        >
                            {reminderOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-200 dark:bg-black/40 dark:border dark:border-cyan-500/30 hover:bg-slate-300 dark:hover:bg-black/60 dark:hover:border-cyan-500/50 rounded-lg transition-colors text-slate-800 dark:text-cyan-300">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 rounded-lg transition-all text-white font-semibold shadow-lg hover:shadow-cyan-500/30 dark:shadow-cyan-500/50 transform hover:scale-105">{taskToEdit ? 'Save Changes' : 'Add Task'}</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;