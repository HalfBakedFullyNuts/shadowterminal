import React from 'react';

/**
 * Renders a condition monitor track (Physical, Stun, Matrix).
 */
export default function ConditionMonitor({ label, color, current, max, onChange }) {
    const percent = (current / max) * 100;

    const colors = {
        red: { bg: 'bg-red-900/10', border: 'border-red-500/30', text: 'text-red-400', bar: 'bg-red-600/50', borderDark: 'border-red-900/50' },
        blue: { bg: 'bg-blue-900/10', border: 'border-blue-500/30', text: 'text-blue-400', bar: 'bg-blue-600/50', borderDark: 'border-blue-900/50' },
        green: { bg: 'bg-green-900/10', border: 'border-green-500/30', text: 'text-green-400', bar: 'bg-green-600/50', borderDark: 'border-green-900/50' }
    };

    const c = colors[color] || colors.red;

    return (
        <div className={`${c.bg} border ${c.border} p-4`}>
            <div className="flex justify-between mb-2">
                <span className={`${c.text} font-bold`}>{label}</span>
                <span className={c.text}>{current} / {max}</span>
            </div>
            <div className={`h-4 bg-black/50 border ${c.borderDark}`}>
                <div className={`h-full ${c.bar} transition-all`} style={{ width: `${percent}%` }} />
            </div>
            <div className="flex gap-2 mt-2 justify-end">
                <button
                    onClick={() => onChange(Math.min(max, current + 1))}
                    className={`w-8 h-8 flex items-center justify-center ${c.bg} hover:bg-opacity-50 text-lg font-bold border ${c.border}`}
                >
                    +
                </button>
                <button
                    onClick={() => onChange(Math.max(0, current - 1))}
                    className={`w-8 h-8 flex items-center justify-center ${c.bg} hover:bg-opacity-50 text-lg font-bold border ${c.border}`}
                >
                    -
                </button>
            </div>
        </div>
    );
}
