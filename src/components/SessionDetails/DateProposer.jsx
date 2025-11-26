import React, { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * Allows users to propose a new date for the session.
 */
export default function DateProposer({ onAddDate }) {
    const [newDate, setNewDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newDate) {
            onAddDate(newDate);
            setNewDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4 border-t border-cyber-cyan/20 pt-4">
            <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="flex-1 bg-cyber-dark border border-cyber-gray p-2 text-white focus:border-cyber-cyan outline-none"
            />
            <button
                type="submit"
                disabled={!newDate}
                className="px-4 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan/40 transition-colors disabled:opacity-50"
            >
                <Plus className="w-5 h-5" />
            </button>
        </form>
    );
}
