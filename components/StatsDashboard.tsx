import React from 'react';
import { UserStats } from '../types';

interface StatsDashboardProps {
    stats: UserStats;
    insights: string[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, insights }) => {
    return (
        <div className="bg-white/70 dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-purple-500/10 backdrop-blur-2xl rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-cyan-400/40 dark:shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <h3 className="text-xl font-bold text-slate-800 dark:text-cyan-300 mb-4 dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                📊 Your Progress Stats
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {/* Total Tasks */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 p-4 rounded-xl border border-blue-200 dark:border-cyan-400/30">
                    <div className="text-3xl font-bold text-blue-600 dark:text-cyan-300 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                        {stats.totalTasksCompleted}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-cyan-200/80 mt-1">Tasks Completed</div>
                </div>

                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 p-4 rounded-xl border border-orange-200 dark:border-orange-400/30">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-300 dark:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">
                        {stats.currentStreak} 🔥
                    </div>
                    <div className="text-sm text-slate-600 dark:text-orange-200/80 mt-1">Current Streak</div>
                </div>

                {/* Longest Streak */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-4 rounded-xl border border-purple-200 dark:border-purple-400/30">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-300 dark:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                        {stats.longestStreak} ⭐
                    </div>
                    <div className="text-sm text-slate-600 dark:text-purple-200/80 mt-1">Longest Streak</div>
                </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-cyan-300 mb-2">
                        💡 Insights
                    </h4>
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200 dark:border-cyan-400/20 text-sm text-slate-700 dark:text-cyan-100"
                        >
                            {insight}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatsDashboard;
