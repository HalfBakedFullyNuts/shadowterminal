import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function AttributeRow({ label, value, onChange, min = 0, max = 6, showMax = false, total = null }) {
    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    return (
        <div className="flex items-center justify-between p-2 bg-cyber-dark/30 border border-cyber-cyan/10 hover:border-cyber-cyan/30 transition-colors group">
            <span className="font-orbitron text-cyber-cyan/80 group-hover:text-cyber-cyan transition-colors">
                {label}
            </span>

            <div className="flex items-center gap-3">
                {total !== null && (
                    <span className="text-sm text-cyber-gray mr-2">
                        Total: <span className="text-white font-bold">{total}</span>
                    </span>
                )}

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded border border-cyber-cyan/20">
                    <button
                        onClick={handleDecrement}
                        disabled={value <= min}
                        className="p-1 hover:text-cyber-magenta disabled:opacity-30 disabled:hover:text-inherit transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= min && val <= max) onChange(val);
                        }}
                        className="w-12 text-center font-bold text-lg bg-transparent text-white border-b border-transparent hover:border-cyber-cyan focus:border-cyber-cyan focus:outline-none transition-colors appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                        onClick={handleIncrement}
                        disabled={value >= max}
                        className="p-1 hover:text-cyber-cyan disabled:opacity-30 disabled:hover:text-inherit transition-colors"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
