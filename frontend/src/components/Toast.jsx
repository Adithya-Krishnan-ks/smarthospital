import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'info', message, onClose, duration = 4000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    let icon = <Info className="text-blue-500" size={20} />;
    let style = 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';

    if (type === 'success') {
        icon = <CheckCircle className="text-emerald-500" size={20} />;
        style = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
    } else if (type === 'error') {
        icon = <AlertCircle className="text-rose-500" size={20} />;
        style = 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400';
    } else if (type === 'warning') {
        icon = <AlertTriangle className="text-amber-500" size={20} />;
        style = 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${style}`}>
                {icon}
                <span className="font-semibold text-sm leading-tight max-w-xs">{message}</span>
                <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors ml-2">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
