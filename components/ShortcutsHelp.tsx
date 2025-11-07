import React from 'react';

interface ShortcutsHelpProps {
    onClose: () => void;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ onClose }) => {
    const shortcuts = [
        { keys: ['Ctrl', 'N'], description: 'Create new task' },
        { keys: ['Ctrl', 'K'], description: 'Open search & filter' },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Export data' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modal/dialog' },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 dark:bg-black/60 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-cyan-400/40 dark:shadow-[0_0_50px_rgba(34,211,238,0.3)] animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-cyan-300">⌨️ Keyboard Shortcuts</h2>
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

                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-slate-50 dark:bg-black/30 rounded-lg border dark:border-cyan-400/20"
                        >
                            <span className="text-slate-700 dark:text-cyan-100 font-medium">
                                {shortcut.description}
                            </span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, i) => (
                                    <React.Fragment key={i}>
                                        <kbd className="px-3 py-1 bg-white dark:bg-cyan-500/20 text-slate-800 dark:text-cyan-300 rounded border-2 border-slate-300 dark:border-cyan-400/40 font-mono text-sm font-semibold shadow-sm">
                                            {key}
                                        </kbd>
                                        {i < shortcut.keys.length - 1 && (
                                            <span className="text-slate-500 dark:text-cyan-400 mx-1">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-cyan-400/70">
                    <p>💡 Tip: Use <kbd className="px-2 py-1 bg-slate-200 dark:bg-cyan-500/20 rounded border dark:border-cyan-400/30">Shift + ?</kbd> anytime to see shortcuts</p>
                </div>
            </div>
        </div>
    );
};

export default ShortcutsHelp;
