import React from 'react';
import { AlertIcon } from '../../constants';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/80 dark:bg-black/50 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-cyan-500/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] dark:shadow-cyan-500/20 animate-scale-in">
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-red-500/10 dark:bg-red-500/20 mb-4 dark:border dark:border-red-500/30">
                        <AlertIcon className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-cyan-300">{title}</h2>
                    <p className="text-slate-500 dark:text-cyan-200/70">{message}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="py-2 px-4 bg-slate-200 dark:bg-black/40 dark:border dark:border-cyan-500/30 hover:bg-slate-300 dark:hover:bg-black/60 dark:hover:border-cyan-500/50 rounded-lg transition-colors text-slate-800 dark:text-cyan-300 font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 dark:shadow-red-500/50">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
