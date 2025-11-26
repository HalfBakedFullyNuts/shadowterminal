import React from 'react';

/**
 * Displays list of users who have voted.
 */
export default function ParticipantList({ availabilities }) {
    return (
        <div className="cyber-border bg-cyber-gray/30 p-6">
            <h3 className="text-xl font-orbitron text-cyber-cyan mb-6">SQUAD STATUS</h3>
            <div className="space-y-4">
                {availabilities.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-cyber-dark/50 border border-cyber-cyan/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan font-bold">
                                {user.userName.charAt(0)}
                            </div>
                            <span className="text-white">{user.userName}</span>
                        </div>
                        <div className="text-sm text-cyber-cyan">
                            {user.availableDates?.length || 0} Dates
                        </div>
                    </div>
                ))}
                {availabilities.length === 0 && (
                    <p className="text-gray-500 italic">No data received yet.</p>
                )}
            </div>
        </div>
    );
}
