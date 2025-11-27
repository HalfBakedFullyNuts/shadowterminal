import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, FileText, Coins, Zap } from 'lucide-react';

export default function MissionLog({ campaign }) {
    const [expandedSession, setExpandedSession] = useState(null);

    const toggleSession = (sessionId) => {
        if (expandedSession === sessionId) {
            setExpandedSession(null);
        } else {
            setExpandedSession(sessionId);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-orbitron text-cyber-cyan border-b border-gray-800 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> MISSION LOGS
            </h3>

            <div className="space-y-4">
                {campaign.sessions.length > 0 ? (
                    campaign.sessions.map((session, index) => (
                        <div key={session.id} className="cyber-border bg-cyber-dark/30 overflow-hidden">
                            <div
                                onClick={() => toggleSession(session.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-cyber-cyan/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-cyber-cyan/10 rounded flex items-center justify-center text-cyber-cyan font-bold font-mono">
                                        {campaign.sessions.length - index}
                                    </div>
                                    <div>
                                        <h4 className="font-orbitron text-white text-lg">{session.title}</h4>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(session.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex items-center gap-4 text-sm font-rajdhani">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Coins className="w-4 h-4" />
                                            {session.nuyen}¥
                                        </div>
                                        <div className="flex items-center gap-1 text-purple-500">
                                            <Zap className="w-4 h-4" />
                                            {session.karma} KARMA
                                        </div>
                                    </div>
                                    {expandedSession === session.id ? (
                                        <ChevronUp className="w-5 h-5 text-cyber-cyan" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </div>

                            {expandedSession === session.id && (
                                <div className="p-4 border-t border-gray-800 bg-black/20 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <h5 className="text-sm font-bold text-cyber-cyan uppercase tracking-wider">Mission Report</h5>
                                            <p className="text-gray-300 leading-relaxed font-rajdhani">
                                                {session.notes}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h5 className="text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-2">Participants</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {session.participants.map(p => (
                                                        <span key={p} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="md:hidden space-y-2">
                                                <h5 className="text-sm font-bold text-cyber-cyan uppercase tracking-wider">Rewards</h5>
                                                <div className="flex gap-4">
                                                    <span className="text-yellow-500 flex items-center gap-1"><Coins className="w-4 h-4" /> {session.nuyen}¥</span>
                                                    <span className="text-purple-500 flex items-center gap-1"><Zap className="w-4 h-4" /> {session.karma} Karma</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-gray-800 rounded">
                        <p className="text-gray-500">NO MISSION LOGS RECORDED</p>
                    </div>
                )}
            </div>
        </div>
    );
}
