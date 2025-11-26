import React from 'react';
import { Calendar, Check, Star, Users } from 'lucide-react';
import DateProposer from './DateProposer';

/**
 * Renders the grid of proposed dates and handles voting interactions.
 * Visualizes availability heatmaps and finalized status.
 */
export default function AvailabilityGrid({ session, availabilities, currentUser, onToggleDate, onAddDate }) {
    const myAvailability = availabilities.find(a => a.userId === currentUser.uid) || { availableDates: [] };
    const isFinal = session.status === 'finalized';

    const getStats = (date) => {
        const count = availabilities.filter(a => a.availableDates?.includes(date)).length;
        const total = availabilities.length || 1;
        return { count, ratio: count / total };
    };

    return (
        <div className="cyber-border bg-cyber-dark/50 p-6">
            <h3 className="text-xl font-orbitron text-cyber-yellow mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> AVAILABILITY MATRIX
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {session.proposedDates.sort().map(date => (
                    <DateCard
                        key={date}
                        date={date}
                        stats={getStats(date)}
                        isAvailable={myAvailability.availableDates?.includes(date)}
                        isFinal={isFinal}
                        isTarget={session.finalDate === date}
                        onToggle={() => onToggleDate(date)}
                    />
                ))}
            </div>

            {!isFinal && <DateProposer onAddDate={onAddDate} />}
        </div>
    );
}

function DateCard({ date, stats, isAvailable, isFinal, isTarget, onToggle }) {
    let bgClass = 'bg-cyber-dark border-cyber-cyan/20';
    if (stats.ratio > 0) bgClass = 'bg-cyber-cyan/10 border-cyber-cyan/40';
    if (stats.ratio > 0.5) bgClass = 'bg-cyber-cyan/20 border-cyber-cyan/60';
    if (stats.ratio === 1) bgClass = 'bg-cyber-cyan/30 border-cyber-cyan box-glow';
    if (isTarget) bgClass = 'bg-cyber-yellow/20 border-cyber-yellow box-glow ring-1 ring-cyber-yellow';

    return (
        <button
            onClick={onToggle}
            disabled={isFinal}
            className={`w-full relative p-4 border transition-all duration-300 text-left group overflow-hidden
                hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:border-cyber-cyan hover:bg-cyber-cyan/10
                active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed
                ${bgClass} ${isAvailable && !isTarget ? 'ring-1 ring-cyber-magenta' : ''}`}
        >
            {/* Hover Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className={`font-mono text-lg ${isTarget ? 'text-cyber-yellow' : 'text-white'} group-hover:text-cyber-cyan transition-colors`}>{date}</span>
                {isAvailable && !isTarget && <Check className="w-4 h-4 text-cyber-magenta" />}
                {isTarget && <Star className="w-4 h-4 text-cyber-yellow fill-cyber-yellow" />}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                <Users className="w-3 h-3" />
                <span>{stats.count} Votes</span>
            </div>
        </button>
    );
}
