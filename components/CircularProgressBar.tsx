
import React from 'react';

interface CircularProgressBarProps {
    percentage: number;
    label: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage, label }) => {
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const isCompleted = percentage >= 100;

    return (
        <div className={`flex flex-col items-center justify-center bg-white/70 backdrop-blur-2xl rounded-2xl p-4 space-y-2 border border-slate-200 shadow-lg transition-all duration-300 dark:bg-transparent dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-indigo-500/10 dark:border-cyan-400/40 dark:shadow-[0_0_40px_rgba(34,211,238,0.3)] dark:backdrop-blur-3xl ${isCompleted ? 'completed-glow' : ''}`}>
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                    <circle
                        stroke="currentColor"
                        className="text-slate-200 dark:text-cyan-500/20"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="url(#progressGradient)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-700 ease-in-out dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-slate-700 dark:text-white dark:drop-shadow-[0_0_10px_rgba(34,211,238,1)]">
                    {`${Math.round(percentage)}%`}
                </span>
            </div>
            <span className="font-semibold text-slate-600 dark:text-cyan-300">{label}</span>
        </div>
    );
};

export default CircularProgressBar;
