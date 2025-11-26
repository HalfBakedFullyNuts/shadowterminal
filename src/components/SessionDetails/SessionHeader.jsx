import React from 'react';
import { Calendar, MapPin, Users, Globe } from 'lucide-react';

/**
 * Displays session metadata (Title, Status, Location).
 * Handles ICS export if finalized.
 */
export default function SessionHeader({ session }) {
    const exportToCalendar = () => {
        if (!session.finalDate) return;
        const event = {
            title: session.title,
            description: session.description,
            start: session.finalDate,
            location: session.location || 'TBD'
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART;VALUE=DATE:${event.start.replace(/-/g, '')}
DTEND;VALUE=DATE:${event.start.replace(/-/g, '')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${session.title.replace(/\s+/g, '_')}.ics`;
        a.click();
    };

    return (
        <div className="cyber-border bg-cyber-gray/50 backdrop-blur-md p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-orbitron text-white text-glow mb-2">{session.title}</h1>
                    <div className="flex flex-wrap gap-6 text-cyber-cyan/70 font-rajdhani">
                        <div className="flex items-center gap-2">
                            {session.type === 'in-person' ? <Users className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                            <span className="uppercase tracking-wider">{session.type}</span>
                        </div>
                        {session.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span className="uppercase tracking-wider">{session.location}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 font-orbitron">STATUS</div>
                    <div className={`text-xl ${session.status === 'open' ? 'text-cyber-cyan' : 'text-cyber-magenta'} font-bold`}>
                        {session.status.toUpperCase()}
                    </div>
                    {session.status === 'finalized' && (
                        <div className="mt-2 text-cyber-yellow font-rajdhani">
                            TARGET: {session.finalDate}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed border-t border-cyber-cyan/20 pt-6 mb-6">
                {session.description}
            </p>

            {session.status === 'finalized' && (
                <button
                    onClick={exportToCalendar}
                    className="w-full py-3 bg-cyber-yellow/10 border border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/20 transition-all font-orbitron flex items-center justify-center gap-2"
                >
                    <Calendar className="w-5 h-5" /> EXPORT MISSION DATA (.ICS)
                </button>
            )}
        </div>
    );
}
