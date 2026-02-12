import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { PlayIcon, PauseIcon, StopIcon } from '../constants';

type PomodoroMode = 'focus' | 'break';

interface PomodoroSettings {
    breakDuration: number; // minutes
}

const defaultSettings: PomodoroSettings = {
    breakDuration: 5,
};

const getSettings = (): PomodoroSettings => {
    try {
        const stored = localStorage.getItem('pomodoroSettings');
        return stored ? JSON.parse(stored) : defaultSettings;
    } catch (e) {
        return defaultSettings;
    }
}

interface PomodoroTimerProps {
    task: Task;
    onComplete: (isCompleted: boolean) => void;
    onStop: () => void;
    startMinimized?: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ task, onComplete, onStop, startMinimized = false }) => {
    const [settings] = useState(getSettings());
    const [mode, setMode] = useState<PomodoroMode>('focus');
    const [timeLeft, setTimeLeft] = useState(task.estimatedDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(startMinimized);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const nextMode = useCallback(() => {
        if (mode === 'focus') {
            setMode('break');
            const breakTime = task.breakDuration ?? settings.breakDuration;
            setTimeLeft(breakTime * 60);
            setIsActive(true); // Automatically start break
        } else { // After a break, the session is over
            setIsActive(false);
            onStop();
        }
    }, [mode, task.breakDuration, settings.breakDuration, onStop]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            new Audio('/api/sounds/notification.mp3').play().catch(() => {});
            
            if (mode === 'focus') {
                 alert(`Focus session for "${task.title}" complete! The task is now marked as finished. Time for a break!`);
                 onComplete(true);
                 nextMode();
            } else {
                alert(`Break is over! Time to get back to work.`);
                nextMode();
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onComplete, mode, nextMode, task.title]);
    
    const getModeStyles = () => {
        switch(mode) {
            case 'focus': return { title: task.title, sub: "Time to focus!", color: "text-cyan-500 dark:text-cyan-400" };
            case 'break':
                const breakTime = task.breakDuration ?? settings.breakDuration;
                return { title: "Break", sub: `Time to relax for ${breakTime} minutes.`, color: "text-green-500 dark:text-green-400" };
        }
    }
    
    const { title, sub, color } = getModeStyles();

    const containerClasses = isMinimized
        ? "fixed bottom-4 right-4 z-50"
        : "fixed inset-0 bg-slate-100/80 dark:bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 z-50 grainy-background";

    const cardClasses = isMinimized
        ? "w-72 sm:w-80 bg-white/90 dark:bg-black/60 backdrop-blur-2xl rounded-2xl p-4 text-left shadow-2xl border border-slate-200 dark:border-cyan-500/30"
        : "w-full max-w-md bg-white/80 dark:bg-black/50 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl border border-slate-200 dark:border-cyan-500/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] dark:shadow-cyan-500/30";

    const timeClasses = isMinimized
        ? "text-4xl sm:text-5xl font-mono font-thin tracking-tight text-slate-800 dark:text-cyan-100"
        : "text-7xl sm:text-9xl font-mono font-thin tracking-tighter text-slate-800 dark:text-cyan-100 dark:drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]";

    return (
        <div className={containerClasses}>
            <div className={cardClasses}>
                <div className={`flex ${isMinimized ? 'items-start justify-between' : 'items-center justify-between'} gap-3`}>
                    <div className={isMinimized ? "text-left" : "text-center w-full"}>
                        <h2 className={`text-xl sm:text-2xl font-bold ${color} transition-colors duration-500 dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]`}>{title}</h2>
                        <p className="text-slate-500 dark:text-cyan-300/70 mt-1">{sub}</p>
                    </div>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="ml-auto text-xs sm:text-sm px-2 py-1 rounded-md bg-slate-200/80 dark:bg-black/40 dark:border dark:border-cyan-500/30 text-slate-600 dark:text-cyan-300 hover:bg-slate-300/80 dark:hover:bg-black/60 transition-colors"
                        title={isMinimized ? "Expand timer" : "Minimize timer"}
                    >
                        {isMinimized ? 'Expand' : 'Minimize'}
                    </button>
                </div>
                <div className={isMinimized ? "my-4" : "my-10"}>
                    <p className={timeClasses}>{formatTime(timeLeft)}</p>
                </div>
                <div className={`flex ${isMinimized ? 'justify-between' : 'justify-center'} items-center ${isMinimized ? 'space-x-3' : 'space-x-6'}`}>
                    <button onClick={onStop} className="p-3 sm:p-4 rounded-full bg-slate-200/80 dark:bg-black/40 dark:border dark:border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/20 dark:hover:border-red-500/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-110">
                        <StopIcon className="w-7 h-7"/>
                    </button>
                    <button onClick={() => setIsActive(!isActive)} className="p-4 sm:p-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white transition-transform hover:scale-110 duration-300 shadow-lg hover:shadow-cyan-400/40 dark:shadow-cyan-500/50 dark:hover:shadow-cyan-500/70">
                        {isActive ? <PauseIcon className="w-9 h-9"/> : <PlayIcon className="w-9 h-9"/>}
                    </button>
                    <button onClick={nextMode} className="p-3 sm:p-4 rounded-full bg-slate-200/80 dark:bg-black/40 dark:border dark:border-cyan-500/30 hover:bg-slate-300/80 dark:hover:bg-black/60 dark:hover:border-cyan-500/50 text-slate-600 dark:text-cyan-400 hover:text-slate-800 dark:hover:text-cyan-300 transition-all duration-300 transform hover:scale-110" title="Skip to next session">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;