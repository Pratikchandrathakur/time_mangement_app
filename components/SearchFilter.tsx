import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../types';

interface SearchFilterProps {
    tasks: Task[];
    onFilteredTasksChange: (tasks: Task[]) => void;
    onClose: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ tasks, onFilteredTasksChange, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending'>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

    useEffect(() => {
        let filtered = [...tasks];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Priority filter
        if (selectedPriority !== 'all') {
            filtered = filtered.filter(task => task.priority === selectedPriority);
        }

        // Status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(task =>
                selectedStatus === 'completed' ? task.completed : !task.completed
            );
        }

        // Period filter
        if (selectedPeriod !== 'all') {
            filtered = filtered.filter(task => task.period === selectedPeriod);
        }

        onFilteredTasksChange(filtered);
    }, [searchQuery, selectedPriority, selectedStatus, selectedPeriod, tasks, onFilteredTasksChange]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedPriority('all');
        setSelectedStatus('all');
        setSelectedPeriod('all');
    };

    const hasActiveFilters = searchQuery || selectedPriority !== 'all' || selectedStatus !== 'all' || selectedPeriod !== 'all';

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto pt-20">
            <div className="bg-white/90 dark:bg-black/60 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-cyan-400/40 dark:shadow-[0_0_50px_rgba(34,211,238,0.3)] animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-cyan-300">Search & Filter Tasks</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-500 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-cyan-500/20 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, description, or tags..."
                            className="w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-400/30 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 p-3 text-slate-800 dark:text-cyan-100 dark:placeholder-cyan-400/40"
                            autoFocus
                        />
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Priority Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80 mb-2">
                                Priority
                            </label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value as any)}
                                className="w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-400/30 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2 text-slate-800 dark:text-cyan-100"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as any)}
                                className="w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-400/30 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2 text-slate-800 dark:text-cyan-100"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Period Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-cyan-400/80 mb-2">
                                Period
                            </label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className="w-full bg-slate-100 dark:bg-black/40 border-slate-300 dark:border-cyan-400/30 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2 text-slate-800 dark:text-cyan-100"
                            >
                                <option value="all">All Periods</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-slate-600 dark:text-cyan-300">
                            Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-cyan-500/20 rounded border dark:border-cyan-400/30">Ctrl+K</kbd> to search
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-slate-200 dark:bg-black/40 dark:border dark:border-cyan-400/30 hover:bg-slate-300 dark:hover:bg-black/60 dark:hover:border-cyan-400/50 rounded-lg transition-colors text-slate-800 dark:text-cyan-300 text-sm font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-cyan-400/60">
                    Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-cyan-500/20 rounded border dark:border-cyan-400/30">Esc</kbd> to close
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
