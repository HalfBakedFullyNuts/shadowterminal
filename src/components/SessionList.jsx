import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Globe, ChevronRight } from 'lucide-react';

export default function SessionList({ sessions = [], loading = false }) {
    // Internal fetching removed in favor of props from Dashboard


    if (loading) {
        return <div className="text-accent-green animate-pulse">SCANNING FOR OPERATIONS...</div>;
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed border-border rounded-sm">
                <p className="text-secondary-text mb-4">NO ACTIVE OPERATIONS FOUND</p>
                <Link
                    to="/create-session"
                    className="text-accent-green hover:underline"
                >
                    INITIATE NEW SESSION
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {sessions.map(session => (
                <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    className="group block"
                >
                    <div className="border border-border bg-panel-background/50 p-6 hover:bg-accent-green/5 transition-all duration-300 group-hover:shadow-[0_0_15px_var(--color-glow-green)] rounded-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-heading text-primary-text group-hover:text-accent-green transition-colors mb-2">
                                    {session.title}
                                </h3>
                                <p className="text-secondary-text text-sm mb-4 line-clamp-2">{session.description}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-accent-green/70">
                                    <div className="flex items-center gap-2">
                                        {session.type === 'in-person' ? <Users className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        <span className="uppercase">{session.type}</span>
                                    </div>

                                    {session.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{session.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{session.proposedDates?.length || 0} DATES PROPOSED</span>
                                    </div>
                                </div>
                            </div>

                            <ChevronRight className="w-6 h-6 text-accent-green/30 group-hover:text-accent-green group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
