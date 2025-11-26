import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSessionData } from './useSessionData';
import SessionHeader from './SessionHeader';
import AvailabilityGrid from './AvailabilityGrid';
import ParticipantList from './ParticipantList';

/**
 * Main container for Session Details view.
 * Orchestrates sub-components and data hook.
 */
export default function SessionDetails() {
    const { sessionId } = useParams();
    const { currentUser } = useAuth();
    const { session, availabilities, loading, toggleDate, addProposedDate } = useSessionData(sessionId, currentUser);

    if (loading || !session) return <div className="text-cyber-cyan animate-pulse p-8">DECRYPTING SESSION DATA...</div>;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <SessionHeader session={session} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AvailabilityGrid
                        session={session}
                        availabilities={availabilities}
                        currentUser={currentUser}
                        onToggleDate={toggleDate}
                        onAddDate={addProposedDate}
                    />
                </div>
                <div>
                    <ParticipantList availabilities={availabilities} />
                </div>
            </div>
        </div>
    );
}
