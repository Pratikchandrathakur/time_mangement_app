import React, { useState } from 'react';
import { Goal } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface GoalSetupModalProps {
    onClose: () => void;
    onSave: (goal: Goal) => void;
}

const GoalSetupModal: React.FC<GoalSetupModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState('');
    const { theme } = useTheme();

    const handleSave = () => {
        if (title && endDate) {
            onSave({
                id: `goal-${Date.now()}`,
                title,
                endDate,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <div className="bg-white/80 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-cyan-500/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] dark:shadow-cyan-500/20 animate-scale-in">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-cyan-300">Set Your Main Goal</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="goal-title" className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Goal Title</label>
                        <input
                            id="goal-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Become a DSA Expert"
                            className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:placeholder-cyan-400/40 dark:backdrop-blur-xl"
                        />
                    </div>
                    <div>
                        <label htmlFor="goal-end-date" className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80">Target Date</label>
                        <input
                            id="goal-end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-500/30 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 sm:text-sm p-2 text-slate-800 dark:text-cyan-100 dark:backdrop-blur-xl"
                            style={{ colorScheme: theme }}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-200 dark:bg-black/40 dark:border dark:border-cyan-500/30 hover:bg-slate-300 dark:hover:bg-black/60 dark:hover:border-cyan-500/50 rounded-lg transition-colors text-slate-800 dark:text-cyan-300">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 rounded-lg transition-colors text-white font-semibold shadow-lg hover:shadow-cyan-500/30 dark:shadow-cyan-500/50">Save Goal</button>
                </div>
            </div>
        </div>
    );
};

export default GoalSetupModal;