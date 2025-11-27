import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Clock, Vote, Users, ChevronRight, AlertCircle, FileText, User, FolderOpen } from 'lucide-react';
import SessionList from './SessionList';
import { getRecentItems } from '../lib/recentItems';
import RunnerStatus from './Dashboard/RunnerStatus';
import ErrorBoundary from './ErrorBoundary';
import CyberButton from './CyberButton';

export default function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextMission, setNextMission] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!nextMission?.dateObj) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextMission.dateObj - now;

            if (diff <= 0) {
                setTimeLeft('MISSION ACTIVE');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [nextMission]);

    // Mock Data for new features
    const [recentIntel, setRecentIntel] = useState([]);

    useEffect(() => {
        setRecentIntel(getRecentItems());
    }, []);

    // Random Glitch Effect
    const [glitch, setGlitch] = useState(false);
    useEffect(() => {
        const triggerGlitch = () => {
            if (Math.random() > 0.7) { // 30% chance to glitch when interval hits
                setGlitch(true);
                setTimeout(() => setGlitch(false), 200);
            }
        };
        // Random interval between 5s and 13s roughly (simulated by checking every 2s with probability)
        const interval = setInterval(triggerGlitch, 5000 + Math.random() * 8000);
        return () => clearInterval(interval);
    }, []);

    const pendingVotes = sessions.filter(s => s.status === 'open' || s.status === 'proposed');

    const myCampaigns = [
        { id: 1, name: 'Neon Rain', character: 'Ghost', role: 'Infiltrator', nextSession: 'Tomorrow' },
        { id: 2, name: 'Corporate Wars', character: 'Null', role: 'Decker', nextSession: 'TBD' }
    ];

    useEffect(() => {
        const q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSessions(sessionsData);

            // Calculate Next Mission
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Compare dates only

            const upcoming = sessionsData
                .filter(s => s.status === 'finalized' && s.finalDate)
                .map(s => ({ ...s, dateObj: new Date(s.finalDate) }))
                .filter(s => s.dateObj >= now)
                .sort((a, b) => a.dateObj - b.dateObj);

            setNextMission(upcoming[0] || null);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <ErrorBoundary>
            <div className={`space-y-8 animate-in fade-in duration-500 ${glitch ? 'skew-x-2 filter hue-rotate-90' : ''}`}>
                {/* Hero Section - Next Mission */}
                {nextMission && (
                    <div className="border border-border bg-panel-background/80 p-1 relative overflow-hidden group rounded-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-green/10 to-transparent opacity-50" />

                        <div className="relative p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-2 text-accent-amber font-heading tracking-widest text-sm">
                                    <span className="animate-pulse">●</span> INCOMING TRANSMISSION
                                </div>

                                <h1 className="text-4xl md:text-5xl font-heading text-primary-text text-glow-green">
                                    {nextMission.title}
                                </h1>

                                <div className="flex flex-wrap gap-6 text-accent-green font-body text-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-primary-text">{nextMission.finalDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-mono text-accent-amber">{timeLeft || 'CALCULATING...'}</span>
                                    </div>
                                    {nextMission.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            <span>{nextMission.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link to={`/session/${nextMission.id}`}>
                                <CyberButton tag="NET_LINK">
                                    JACK IN
                                </CyberButton>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Quick Access Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Votes / Active Ops */}
                    <div className="border border-border bg-panel-background/50 p-6 space-y-4 rounded-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-heading text-accent-red flex items-center gap-2">
                                <Vote className="w-5 h-5" /> PENDING VOTES
                            </h3>
                            <Link to="/create-session" className="text-xs text-accent-green hover:text-primary-text transition-colors flex items-center gap-1">
                                <Plus className="w-3 h-3" /> NEW
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {pendingVotes.slice(0, 3).map(session => (
                                <Link key={session.id} to={`/session/${session.id}`} className="block bg-background/40 p-3 border-l-2 border-accent-red hover:bg-accent-red/10 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <span className="text-primary-text font-body font-bold group-hover:text-accent-red transition-colors truncate">{session.title}</span>
                                        {session.status === 'open' && <AlertCircle className="w-4 h-4 text-accent-green animate-pulse" />}
                                    </div>
                                    <div className="text-xs text-secondary-text mt-1 flex justify-between">
                                        <span>{session.proposedDates?.length || 0} Dates Proposed</span>
                                        <span className="uppercase">{session.status}</span>
                                    </div>
                                </Link>
                            ))}
                            {pendingVotes.length === 0 && <div className="text-secondary-text text-sm italic">No active votes required.</div>}
                        </div>

                        {/* Recent Intel Section */}
                        <div className="pt-4 border-t border-border">
                            <h3 className="text-lg font-heading text-accent-amber flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4" /> RECENT INTEL
                            </h3>
                            <div className="space-y-2">
                                {recentIntel.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-secondary-text hover:text-accent-amber transition-colors cursor-pointer">
                                        {item.type === 'npc' ? <User className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                        <span className="truncate">{item.title || item.name}</span>
                                    </div>
                                ))}
                                {recentIntel.length === 0 && <div className="text-secondary-text text-sm italic">No recent intel accessed.</div>}
                            </div>
                        </div>
                    </div>

                    {/* Runner Status / Asset Overview */}
                    <div className="h-full">
                        <RunnerStatus />
                    </div>

                    {/* Quick Actions */}
                    <div className="border border-border bg-panel-background/50 p-6 space-y-4 rounded-sm">
                        <h3 className="text-xl font-heading text-accent-green flex items-center gap-2">
                            <ChevronRight className="w-5 h-5" /> QUICK ACCESS
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/characters" className="p-3 bg-background/40 border border-border hover:border-accent-green hover:text-accent-green transition-all text-center flex flex-col items-center gap-2 group rounded-sm">
                                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold">CHARACTERS</span>
                            </Link>
                            <Link to="/create-session" className="p-3 bg-background/40 border border-border hover:border-accent-green hover:text-accent-green transition-all text-center flex flex-col items-center gap-2 group rounded-sm">
                                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold">NEW SESSION</span>
                            </Link>
                            <Link to="/drive" className="p-3 bg-background/40 border border-border hover:border-accent-green hover:text-accent-green transition-all text-center flex flex-col items-center gap-2 group rounded-sm">
                                <FolderOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold">ARCHIVES</span>
                            </Link>
                            <div className="p-3 bg-background/40 border border-border hover:border-accent-red hover:text-accent-red transition-all text-center flex flex-col items-center gap-2 group cursor-not-allowed opacity-50 rounded-sm">
                                <AlertCircle className="w-6 h-6" />
                                <span className="text-sm font-bold">PANIC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Operations Header */}
                <div className="flex justify-between items-center border-b border-border pb-4">
                    <h2 className="text-2xl font-heading text-accent-amber">ACTIVE OPERATIONS</h2>
                    <Link
                        to="/create-session"
                        className="flex items-center gap-2 px-4 py-2 bg-accent-green/10 border border-accent-green text-accent-green hover:bg-accent-green/20 transition-all font-heading text-sm rounded-sm"
                    >
                        <Plus className="w-4 h-4" /> NEW SESSION
                    </Link>
                </div>

                <SessionList sessions={sessions} loading={loading} />
            </div>
        </ErrorBoundary>
    );
}
