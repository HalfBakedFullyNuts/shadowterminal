import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Clock, Vote, Users, ChevronRight, AlertCircle, FileText, User, FolderOpen, X, MessageSquare, Phone, ChevronDown, ChevronLeft, Shield } from 'lucide-react';
import SessionList from './SessionList';
import { getRecentItems } from '../lib/recentItems';
import ErrorBoundary from './ErrorBoundary';
import CyberButton from './CyberButton';
import { useAuth } from '../contexts/AuthContext';

// Character Summary Card Component
function CharacterCard({ character, isActive = true }) {
    if (!character) return null;

    const renderStat = (val) => {
        if (val && typeof val === 'object') {
            return val.total || val.current || val.rating || 0;
        }
        return val || 0;
    };

    return (
        <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 absolute'}`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="text-lg font-heading text-primary-text">{character.name || 'UNKNOWN'}</div>
                    <div className="text-xs text-accent-green">{character.archetype || 'FREELANCER'} • {character.metatype || 'Human'}</div>
                </div>
                <Link
                    to={`/characters/${character.id}`}
                    className="text-xs text-secondary-text hover:text-accent-green transition-colors"
                >
                    VIEW →
                </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background/40 p-2 rounded-sm">
                    <div className="text-xs text-secondary-text">NUYEN</div>
                    <div className="text-sm font-mono text-accent-green">¥{renderStat(character.nuyen).toLocaleString()}</div>
                </div>
                <div className="bg-background/40 p-2 rounded-sm">
                    <div className="text-xs text-secondary-text">KARMA</div>
                    <div className="text-sm font-mono text-primary-text">{renderStat(character.karma)}</div>
                </div>
                <div className="bg-background/40 p-2 rounded-sm">
                    <div className="text-xs text-secondary-text">CRED</div>
                    <div className="text-sm font-mono text-accent-amber">{renderStat(character.streetCred)}</div>
                </div>
                <div className="bg-background/40 p-2 rounded-sm">
                    <div className="text-xs text-secondary-text">NOTOR</div>
                    <div className="text-sm font-mono text-accent-red">{renderStat(character.notoriety)}</div>
                </div>
            </div>
        </div>
    );
}

// Past Operation Item Component
function PastOperationItem({ session }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border border-border bg-background/20 rounded-sm overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-3 flex items-center justify-between hover:bg-accent-green/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-secondary-text" />
                    <span className="text-sm text-primary-text">{session.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-secondary-text">{session.finalDate || 'No date'}</span>
                    <ChevronDown className={`w-4 h-4 text-secondary-text transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {expanded && (
                <div className="p-3 border-t border-border bg-panel-background/30 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-secondary-text mb-3">
                        {session.notes || session.description || 'No notes recorded for this session.'}
                    </p>
                    <Link
                        to={`/session/${session.id}`}
                        className="text-xs text-accent-green hover:text-primary-text transition-colors flex items-center gap-1"
                    >
                        VIEW FULL REPORT <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextMission, setNextMission] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [showPanicModal, setShowPanicModal] = useState(false);
    const [panicSent, setPanicSent] = useState(false);

    // Campaign-related state
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);

    // Character-related state for Asset Overview
    const [myCharacters, setMyCharacters] = useState([]);
    const [allCampaignCharacters, setAllCampaignCharacters] = useState([]);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [isHoveringSlider, setIsHoveringSlider] = useState(false);

    // Get selected campaign
    const selectedCampaign = useMemo(() =>
        campaigns.find(c => c.id === selectedCampaignId) || campaigns[0],
        [campaigns, selectedCampaignId]
    );

    // Check if user is GM of selected campaign
    const isGM = selectedCampaign?.gmId === currentUser?.uid;

    // Fetch campaigns user is part of
    useEffect(() => {
        if (!currentUser) return;

        const fetchCampaigns = async () => {
            try {
                // Fetch campaigns where user is GM
                const gmQuery = query(collection(db, 'campaigns'), where('gmId', '==', currentUser.uid));
                const gmSnapshot = await getDocs(gmQuery);
                const gmCampaigns = gmSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch campaigns where user is a player
                const playerQuery = query(collection(db, 'campaigns'), where('players', 'array-contains', currentUser.uid));
                const playerSnapshot = await getDocs(playerQuery);
                const playerCampaigns = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Combine and deduplicate
                const allCampaigns = [...gmCampaigns];
                playerCampaigns.forEach(pc => {
                    if (!allCampaigns.find(c => c.id === pc.id)) {
                        allCampaigns.push(pc);
                    }
                });

                setCampaigns(allCampaigns);
                if (allCampaigns.length > 0 && !selectedCampaignId) {
                    setSelectedCampaignId(allCampaigns[0].id);
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        fetchCampaigns();
    }, [currentUser]);

    // Fetch characters for the selected campaign
    useEffect(() => {
        if (!currentUser || !selectedCampaign) return;

        const fetchCharacters = async () => {
            try {
                if (isGM) {
                    // GM sees all player characters in the campaign
                    const allCharsQuery = query(
                        collection(db, 'characters'),
                        where('campaignId', '==', selectedCampaign.id)
                    );
                    const snapshot = await getDocs(allCharsQuery);
                    const chars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setAllCampaignCharacters(chars);
                    setMyCharacters([]);
                } else {
                    // Player sees only their own characters
                    const myCharsQuery = query(
                        collection(db, 'characters'),
                        where('userId', '==', currentUser.uid),
                        where('campaignId', '==', selectedCampaign.id)
                    );
                    const snapshot = await getDocs(myCharsQuery);
                    const chars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMyCharacters(chars);
                    setAllCampaignCharacters([]);
                }
            } catch (error) {
                console.error("Error fetching characters:", error);
                // Fallback: fetch user's characters without campaign filter
                try {
                    const fallbackQuery = query(
                        collection(db, 'characters'),
                        where('userId', '==', currentUser.uid)
                    );
                    const snapshot = await getDocs(fallbackQuery);
                    const chars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMyCharacters(chars);
                } catch (e) {
                    console.error("Fallback query failed:", e);
                }
            }
        };

        fetchCharacters();
    }, [currentUser, selectedCampaign, isGM]);

    // Auto-rotate character slider for GM (every 10 seconds)
    useEffect(() => {
        if (!isGM || allCampaignCharacters.length <= 1 || isHoveringSlider) return;

        const interval = setInterval(() => {
            setCurrentCharacterIndex(prev =>
                (prev + 1) % allCampaignCharacters.length
            );
        }, 10000);

        return () => clearInterval(interval);
    }, [isGM, allCampaignCharacters.length, isHoveringSlider]);

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
            if (Math.random() > 0.7) {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 200);
            }
        };
        const interval = setInterval(triggerGlitch, 5000 + Math.random() * 8000);
        return () => clearInterval(interval);
    }, []);

    const pendingVotes = sessions.filter(s => s.status === 'open' || s.status === 'proposed');

    // Filter sessions by selected campaign and separate current vs past
    const campaignSessions = useMemo(() => {
        if (!selectedCampaignId) return { current: [], past: [] };

        const filtered = sessions.filter(s => s.campaignId === selectedCampaignId);
        const now = new Date();

        const current = filtered.filter(s => {
            if (s.status === 'finalized' && s.finalDate) {
                const sessionDate = new Date(s.finalDate);
                return sessionDate >= now;
            }
            return s.status === 'open' || s.status === 'proposed';
        });

        const past = filtered.filter(s => {
            if (s.status === 'finalized' && s.finalDate) {
                const sessionDate = new Date(s.finalDate);
                return sessionDate < now;
            }
            return s.status === 'completed' || s.status === 'archived';
        }).sort((a, b) => {
            const dateA = a.finalDate ? new Date(a.finalDate) : new Date(0);
            const dateB = b.finalDate ? new Date(b.finalDate) : new Date(0);
            return dateB - dateA;
        });

        return { current, past };
    }, [sessions, selectedCampaignId]);

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
            now.setHours(0, 0, 0, 0);

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

    const navigateCharacter = (direction) => {
        if (allCampaignCharacters.length === 0) return;
        setCurrentCharacterIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % allCampaignCharacters.length;
            } else {
                return prev === 0 ? allCampaignCharacters.length - 1 : prev - 1;
            }
        });
    };

    return (
        <ErrorBoundary>
            <div className={`space-y-8 animate-in fade-in duration-500 ${glitch ? 'skew-x-2 filter hue-rotate-90' : ''}`}>

                {/* Campaign Header */}
                {selectedCampaign && (
                    <div className="border border-border bg-panel-background/50 p-6 rounded-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Shield className="w-8 h-8 text-accent-red" />
                                <div>
                                    {campaigns.length > 1 ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
                                                className="flex items-center gap-2 text-2xl font-heading text-primary-text hover:text-accent-green transition-colors"
                                            >
                                                {selectedCampaign.title}
                                                <ChevronDown className={`w-5 h-5 transition-transform ${campaignDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {campaignDropdownOpen && (
                                                <div className="absolute top-full left-0 mt-2 w-64 bg-panel-background border border-border rounded-sm shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {campaigns.map(campaign => (
                                                        <button
                                                            key={campaign.id}
                                                            onClick={() => {
                                                                setSelectedCampaignId(campaign.id);
                                                                setCampaignDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left p-3 hover:bg-accent-green/10 transition-colors ${
                                                                campaign.id === selectedCampaignId ? 'bg-accent-green/20 text-accent-green' : 'text-primary-text'
                                                            }`}
                                                        >
                                                            <div className="font-heading">{campaign.title}</div>
                                                            <div className="text-xs text-secondary-text">GM: {campaign.gmName}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <h1 className="text-2xl font-heading text-primary-text">{selectedCampaign.title}</h1>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-secondary-text mt-1">
                                        <Users className="w-4 h-4" />
                                        <span>GM: <span className="text-accent-amber">{selectedCampaign.gmName}</span></span>
                                        {isGM && <span className="ml-2 px-2 py-0.5 bg-accent-red/20 text-accent-red text-xs rounded-sm">YOU ARE GM</span>}
                                    </div>
                                </div>
                            </div>
                            <Link to={`/campaigns/${selectedCampaign.id}`}>
                                <CyberButton tag="CAMPAIGN" size="small">
                                    OPEN DOSSIER
                                </CyberButton>
                            </Link>
                        </div>
                    </div>
                )}

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
                    {/* Asset Overview - Now larger and campaign-aware */}
                    <div
                        className="md:col-span-2 border border-border bg-panel-background/50 p-6 rounded-sm"
                        onMouseEnter={() => setIsHoveringSlider(true)}
                        onMouseLeave={() => setIsHoveringSlider(false)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-heading text-accent-amber flex items-center gap-2">
                                <User className="w-5 h-5" /> ASSET OVERVIEW
                            </h3>
                            {isGM && allCampaignCharacters.length > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigateCharacter('prev')}
                                        className="p-1 text-secondary-text hover:text-accent-green transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-xs text-secondary-text">
                                        {currentCharacterIndex + 1} / {allCampaignCharacters.length}
                                    </span>
                                    <button
                                        onClick={() => navigateCharacter('next')}
                                        className="p-1 text-secondary-text hover:text-accent-green transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* GM View: Rotating Character Cards */}
                        {isGM && allCampaignCharacters.length > 0 && (
                            <div className="relative min-h-[120px]">
                                {allCampaignCharacters.map((char, idx) => (
                                    <CharacterCard
                                        key={char.id}
                                        character={char}
                                        isActive={idx === currentCharacterIndex}
                                    />
                                ))}
                                {/* Progress indicator */}
                                {allCampaignCharacters.length > 1 && (
                                    <div className="flex justify-center gap-1 mt-4">
                                        {allCampaignCharacters.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentCharacterIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    idx === currentCharacterIndex
                                                        ? 'bg-accent-green w-4'
                                                        : 'bg-secondary-text/30 hover:bg-secondary-text/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Player View: Own Characters */}
                        {!isGM && myCharacters.length > 0 && (
                            <div className="space-y-4">
                                {myCharacters.map(char => (
                                    <CharacterCard key={char.id} character={char} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {((isGM && allCampaignCharacters.length === 0) || (!isGM && myCharacters.length === 0)) && (
                            <div className="text-center py-8 text-secondary-text">
                                <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No characters found for this campaign</p>
                                <Link
                                    to="/characters/new"
                                    className="inline-block mt-3 text-accent-green hover:text-primary-text transition-colors text-sm"
                                >
                                    + CREATE CHARACTER
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions + Pending Votes Combined */}
                    <div className="border border-border bg-panel-background/50 p-6 space-y-6 rounded-sm">
                        <div>
                            <h3 className="text-xl font-heading text-accent-green flex items-center gap-2 mb-4">
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
                                <button
                                    onClick={() => setShowPanicModal(true)}
                                    className="p-3 bg-background/40 border border-border hover:border-accent-red hover:text-accent-red hover:bg-accent-red/10 transition-all text-center flex flex-col items-center gap-2 group rounded-sm"
                                >
                                    <AlertCircle className="w-6 h-6 group-hover:animate-pulse" />
                                    <span className="text-sm font-bold">PANIC</span>
                                </button>
                            </div>
                        </div>

                        {/* Pending Votes Section - Moved here */}
                        <div className="border-t border-border pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-heading text-accent-red flex items-center gap-2">
                                    <Vote className="w-4 h-4" /> PENDING VOTES
                                </h3>
                                <Link to="/create-session" className="text-xs text-accent-green hover:text-primary-text transition-colors flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> NEW
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {pendingVotes.slice(0, 3).map(session => (
                                    <Link key={session.id} to={`/session/${session.id}`} className="block bg-background/40 p-2 border-l-2 border-accent-red hover:bg-accent-red/10 transition-colors group">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-primary-text font-body font-bold group-hover:text-accent-red transition-colors truncate">{session.title}</span>
                                            {session.status === 'open' && <AlertCircle className="w-3 h-3 text-accent-green animate-pulse" />}
                                        </div>
                                        <div className="text-xs text-secondary-text mt-1">
                                            {session.proposedDates?.length || 0} dates • {session.status.toUpperCase()}
                                        </div>
                                    </Link>
                                ))}
                                {pendingVotes.length === 0 && <div className="text-secondary-text text-xs italic">No active votes.</div>}
                            </div>
                        </div>

                        {/* Recent Intel Section */}
                        <div className="border-t border-border pt-4">
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
                                {recentIntel.length === 0 && <div className="text-secondary-text text-xs italic">No recent intel.</div>}
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

                {/* Current Sessions */}
                <SessionList sessions={campaignSessions.current.length > 0 ? campaignSessions.current : sessions.filter(s => s.status !== 'completed' && s.status !== 'archived')} loading={loading} />

                {/* Past Operations - Expandable List */}
                {campaignSessions.past.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-heading text-secondary-text flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> PAST OPERATIONS
                        </h2>
                        <div className="space-y-2">
                            {campaignSessions.past.map(session => (
                                <PastOperationItem key={session.id} session={session} />
                            ))}
                        </div>
                    </div>
                )}

                {/* PANIC Modal */}
                {showPanicModal && (
                    <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <div className="bg-panel-background border-2 border-accent-red p-6 max-w-md w-full mx-4 rounded-sm shadow-[0_0_30px_var(--color-accent-red)]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-heading text-accent-red flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 animate-pulse" />
                                    EMERGENCY PROTOCOL
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowPanicModal(false);
                                        setPanicSent(false);
                                    }}
                                    className="text-secondary-text hover:text-accent-red transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {!panicSent ? (
                                <div className="space-y-4">
                                    <p className="text-secondary-text text-sm">
                                        Broadcast an emergency message to your team. Select an option:
                                    </p>

                                    <button
                                        onClick={() => {
                                            setPanicSent(true);
                                        }}
                                        className="w-full p-4 border border-accent-amber bg-accent-amber/10 hover:bg-accent-amber/20 transition-all text-left rounded-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-accent-amber" />
                                            <div>
                                                <p className="text-accent-amber font-heading">RUNNING LATE</p>
                                                <p className="text-secondary-text text-xs">Notify team you'll be delayed</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPanicSent(true);
                                        }}
                                        className="w-full p-4 border border-accent-red bg-accent-red/10 hover:bg-accent-red/20 transition-all text-left rounded-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <X className="w-5 h-5 text-accent-red" />
                                            <div>
                                                <p className="text-accent-red font-heading">CAN'T MAKE IT</p>
                                                <p className="text-secondary-text text-xs">Emergency cancellation notice</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPanicSent(true);
                                        }}
                                        className="w-full p-4 border border-accent-cyan bg-accent-cyan/10 hover:bg-accent-cyan/20 transition-all text-left rounded-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-accent-cyan" />
                                            <div>
                                                <p className="text-accent-cyan font-heading">NEED BACKUP</p>
                                                <p className="text-secondary-text text-xs">Request immediate assistance</p>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="border-t border-border pt-4 mt-4">
                                        <p className="text-xs text-secondary-text mb-2">Emergency Contact</p>
                                        <div className="flex items-center gap-2 text-primary-text">
                                            <Phone className="w-4 h-4 text-accent-green" />
                                            <span className="font-mono">GM: Check Campaign Details</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-accent-green" />
                                    </div>
                                    <p className="text-accent-green font-heading text-xl mb-2">SIGNAL SENT</p>
                                    <p className="text-secondary-text text-sm">
                                        Your team has been notified via {currentUser?.displayName || 'Runner'}'s emergency broadcast.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShowPanicModal(false);
                                            setPanicSent(false);
                                        }}
                                        className="mt-6 px-6 py-2 border border-accent-green text-accent-green hover:bg-accent-green/10 transition-all rounded-sm"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
