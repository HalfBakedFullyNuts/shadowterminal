import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useSessionData } from './SessionDetails/useSessionData';
import { Calendar, MapPin, Users, Globe, Check, X, Star, Trash2 } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CyberButton from './CyberButton';

export default function SessionDetails() {
    const { sessionId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const { session, availabilities, loading, toggleDate, finalizeSession } = useSessionData(sessionId, currentUser);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Redirect if session not found (handled in hook via session check, but we can add a check here)
    useEffect(() => {
        if (!loading && !session) {
            navigate('/');
        }
    }, [session, loading, navigate]);

    const myAvailability = availabilities.find(a => a.userId === currentUser.uid) || { availableDates: [] };

    const [accessToken, setAccessToken] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [syncError, setSyncError] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);

    // Load GAPI & GIS
    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client', async () => {
                    await window.gapi.client.init({
                        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    });
                });
            };
            document.body.appendChild(script);
        };

        const loadGis = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            document.body.appendChild(script);
        };

        loadGapi();
        loadGis();
    }, []);

    const handleAuthorize = () => {
        const tokenClient = window.google?.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.events',
            callback: (response) => {
                if (response.access_token) {
                    setAccessToken(response.access_token);
                    window.gapi.client.setToken({ access_token: response.access_token });
                }
            },
        });
        tokenClient.requestAccessToken();
    };

    const handleSync = async () => {
        if (!session.finalDate) return;
        setSyncing(true);
        setSyncError('');
        setSyncSuccess(false);

        try {
            const event = {
                summary: session.title,
                description: session.description,
                start: {
                    date: session.finalDate, // All-day event
                },
                end: {
                    date: session.finalDate, // Google Calendar end date is exclusive for all-day events, but for single day it works if same or next day. 
                    // Better to be safe: For all-day, end date should be next day.
                    // Let's parse and add 1 day for correctness
                },
                location: session.location || 'TBD',
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 20160 }, // 14 days * 24 * 60
                        { method: 'popup', minutes: 1440 }, // 1 day
                    ],
                },
            };

            // Fix end date for all-day event
            const endDate = new Date(session.finalDate);
            endDate.setDate(endDate.getDate() + 1);
            event.end.date = endDate.toISOString().split('T')[0];

            if (isRecurring) {
                event.recurrence = ['RRULE:FREQ=WEEKLY'];
            }

            await window.gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            });

            setSyncSuccess(true);
        } catch (err) {
            console.error("Calendar Sync Error", err);
            setSyncError('Failed to sync. ' + (err.result?.error?.message || err.message));
        }
        setSyncing(false);
    };

    const exportToCalendar = () => {
        if (!session.finalDate) return;
        const event = {
            title: session.title,
            description: session.description,
            start: session.finalDate,
            end: session.finalDate,
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

    const getAvailabilityCount = (date) => {
        return availabilities.filter(a => a.availableDates?.includes(date)).length;
    };

    const getAvailabilityRatio = (date) => {
        if (availabilities.length === 0) return 0;
        return getAvailabilityCount(date) / availabilities.length;
    };

    const handleDelete = async () => {
        if (!window.confirm("WARNING: TERMINATING OPERATION. This action is irreversible. Confirm deletion?")) return;

        setDeleting(true);
        try {
            await deleteDoc(doc(db, 'sessions', sessionId));
            navigate('/');
        } catch (error) {
            console.error("Error deleting session:", error);
            alert("Failed to terminate operation.");
            setDeleting(false);
        }
    };

    const formatDateWithDay = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    };

    if (loading || !session) return <div className="text-cyber-cyan animate-pulse">DECRYPTING SESSION DATA...</div>;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
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
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={exportToCalendar}
                                className="flex-1 py-3 bg-cyber-dark border border-cyber-yellow/50 text-cyber-yellow hover:bg-cyber-yellow/10 transition-all font-orbitron flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-5 h-5" /> EXPORT .ICS
                            </button>

                            {!accessToken ? (
                                <CyberButton
                                    onClick={handleAuthorize}
                                    tag="G_LINK"
                                    className="flex-1 w-full"
                                    style={{ '--primary-hue': 190, '--shadow-primary-hue': 320 }}
                                >
                                    CONNECT GOOGLE CALENDAR
                                </CyberButton>
                            ) : (
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 p-2 bg-cyber-dark border border-gray-700">
                                        <input
                                            type="checkbox"
                                            id="recurring"
                                            checked={isRecurring}
                                            onChange={(e) => setIsRecurring(e.target.checked)}
                                            className="w-4 h-4 accent-cyber-cyan"
                                        />
                                        <label htmlFor="recurring" className="text-sm text-gray-300 font-mono cursor-pointer select-none">
                                            Make Permanently Recurring (Weekly)
                                        </label>
                                    </div>
                                    <CyberButton
                                        onClick={handleSync}
                                        disabled={syncing || syncSuccess}
                                        tag="SYNC_OP"
                                        className="w-full"
                                        style={{
                                            '--primary-hue': syncSuccess ? 120 : 190,
                                            '--shadow-primary-hue': syncSuccess ? 60 : 320
                                        }}
                                    >
                                        {syncing ? 'SYNCING...' : syncSuccess ? 'SYNC COMPLETE' : 'SYNC TO CALENDAR'}
                                    </CyberButton>
                                </div>
                            )}
                        </div>
                        {syncError && (
                            <div className="text-red-400 text-sm font-mono border border-red-500/30 bg-red-500/10 p-2">
                                ERROR: {syncError}
                            </div>
                        )}
                        {syncSuccess && (
                            <div className="text-green-400 text-sm font-mono border border-green-500/30 bg-green-500/10 p-2 text-center">
                                MISSION UPLOADED TO GOOGLE CALENDAR. EMAIL REMINDER SET (T-14 DAYS).
                            </div>
                        )}
                    </div>
                )}


                {session.createdBy === currentUser.uid && (
                    <div className="mt-8 border-t border-red-500/20 pt-6 flex justify-end">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-orbitron text-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleting ? 'TERMINATING...' : 'DELETE OPERATION'}
                        </button>
                    </div>
                )}
            </div>

            {/* Availability Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Date Selection */}
                <div className="lg:col-span-2">
                    <div className="cyber-border bg-cyber-dark/50 p-6">
                        <h3 className="text-xl font-orbitron text-cyber-yellow mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> AVAILABILITY MATRIX
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {session.proposedDates.sort().map(date => {
                                const isAvailable = myAvailability.availableDates?.includes(date);
                                const count = getAvailabilityCount(date);
                                const ratio = getAvailabilityRatio(date);
                                const isCreator = currentUser.uid === session.createdBy;
                                const isFinal = session.status === 'finalized';
                                const isTarget = session.finalDate === date;

                                // Heatmap color calculation
                                let bgClass = 'bg-cyber-dark border-cyber-cyan/20';
                                if (ratio > 0) bgClass = 'bg-cyber-cyan/10 border-cyber-cyan/40';
                                if (ratio > 0.5) bgClass = 'bg-cyber-cyan/20 border-cyber-cyan/60';
                                if (ratio === 1) bgClass = 'bg-cyber-cyan/30 border-cyber-cyan box-glow';

                                if (isTarget) bgClass = 'bg-cyber-yellow/20 border-cyber-yellow box-glow ring-1 ring-cyber-yellow';

                                return (
                                    <div key={date} className="relative group">
                                        <button
                                            onClick={() => !isFinal && toggleDate(date)}
                                            disabled={saving || isFinal}
                                            className={`w-full relative p-4 border transition-all duration-300 text-left ${bgClass} ${isAvailable && !isTarget ? 'ring-1 ring-cyber-magenta' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`font-mono text-lg ${isTarget ? 'text-cyber-yellow' : 'text-white'}`}>
                                                    {formatDateWithDay(date)}
                                                </span>
                                                {isAvailable && !isTarget && <Check className="w-4 h-4 text-cyber-magenta" />}
                                                {isTarget && <Star className="w-4 h-4 text-cyber-yellow fill-cyber-yellow" />}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Users className="w-3 h-3" />
                                                <span>{count} / {availabilities.length || 1} Available</span>
                                            </div>
                                        </button>

                                        {isCreator && !isFinal && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); finalizeSession(date); }}
                                                className="absolute -top-2 -right-2 bg-cyber-dark border border-cyber-yellow text-cyber-yellow p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyber-yellow hover:text-cyber-dark z-10"
                                                title="Finalize this date"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Participants List */}
                <div>
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
                </div>
            </div>
        </div>
    );
}
