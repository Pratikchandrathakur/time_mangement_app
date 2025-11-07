import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '../constants';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 22) return "Good Evening";
    return "Good Night";
};

const Header: React.FC = () => {
    const [greeting, setGreeting] = useState(getGreeting());
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="p-4 sm:p-6 bg-white/80 dark:bg-transparent dark:bg-gradient-to-r dark:from-cyan-500/10 dark:via-transparent dark:to-purple-500/10 backdrop-blur-xl border-b border-slate-200 dark:border-cyan-400/40 flex justify-between items-center sticky top-0 z-10 dark:shadow-[0_8px_50px_rgba(34,211,238,0.3)]">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_20px_rgba(34,211,238,1)]">{greeting}</h1>
                <p className="text-slate-500 dark:text-cyan-200">Let's make today productive.</p>
            </div>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-cyan-500/20 transition-colors dark:border-2 dark:border-cyan-400/50 dark:hover:border-cyan-400 dark:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6 dark:drop-shadow-[0_0_10px_rgba(34,211,238,1)]" />}
            </button>
        </header>
    );
};

export default Header;