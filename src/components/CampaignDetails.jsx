import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Users, Calendar, HardDrive, ExternalLink, Plus, FolderOpen, Database, FileText } from 'lucide-react';
import NPCManager from './Campaign/NPCManager';
import ClueManager from './Campaign/ClueManager';
import DriveBrowser from './Drive/DriveBrowser';
import CyberButton from './CyberButton';

export default function CampaignDetails() {
    const { campaignId } = useParams();
    const { currentUser } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driveLoading, setDriveLoading] = useState(false);
    const [clues, setClues] = useState([]); // Fetch clues for NPC manager linking

    useEffect(() => {
        if (!campaignId) return;
        const q = query(collection(db, `campaigns/${campaignId}/clues`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setClues(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, [campaignId]);

    useEffect(() => {
        if (!campaignId) return;

        const unsubCampaign = onSnapshot(doc(db, 'campaigns', campaignId), (doc) => {
            if (doc.exists()) {
                setCampaign({ id: doc.id, ...doc.data() });
            }
        });

        const q = query(collection(db, 'sessions'), where('campaignId', '==', campaignId));
        const unsubSessions = onSnapshot(q, (snapshot) => {
            const sessionList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setSessions(sessionList);
            setLoading(false);
        });

        return () => {
            unsubCampaign();
            unsubSessions();
        };
    }, [campaignId]);

    const handleLinkDrive = async () => {
        // This assumes the Google Drive Picker API is loaded or we use a simple prompt for Folder ID for now
        // For a full implementation, we'd need the Picker API. 
        // To keep it simple and robust for this iteration, let's ask for a Folder ID or URL.

        const input = window.prompt("Enter Google Drive Folder ID or URL:");
        if (!input) return;

        let folderId = input;
        // Basic extraction of ID from URL if provided
        if (input.includes('drive.google.com')) {
            const match = input.match(/folders\/([a-zA-Z0-9-_]+)/);
            if (match) folderId = match[1];
        }

        setDriveLoading(true);
        try {
            await updateDoc(doc(db, 'campaigns', campaignId), {
                driveFolderId: folderId
            });
        } catch (error) {
            console.error("Error linking drive:", error);
            alert("Failed to link Drive folder.");
        }
        setDriveLoading(false);
    };

    if (loading) return <div className="text-accent-green animate-pulse p-8">DECRYPTING CAMPAIGN DATA...</div>;
    if (!campaign) return <div className="text-accent-red p-8">CAMPAIGN NOT FOUND OR ACCESS DENIED.</div>;

    const isGM = campaign.gmId === currentUser.uid;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="border border-border bg-panel-background/50 backdrop-blur-md p-8 mb-8 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-accent-red" />
                            <span className="text-accent-red font-mono text-sm tracking-widest">CAMPAIGN FILE</span>
                        </div>
                        <h1 className="text-4xl font-heading text-primary-text text-glow-green mb-4">{campaign.title}</h1>
                        <div className="flex flex-wrap gap-6 text-accent-green/70 font-body">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span className="uppercase tracking-wider">GM: {campaign.gmName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="uppercase tracking-wider">EST: {campaign.createdAt?.toDate().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex gap-4">
                            {isGM && (
                                <button
                                    onClick={handleLinkDrive}
                                    disabled={driveLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-background border border-border text-secondary-text hover:border-accent-green hover:text-accent-green transition-all rounded-sm"
                                >
                                    {campaign.driveFolderId ? (
                                        <>
                                            <HardDrive className="w-4 h-4" />
                                            UPDATE DRIVE LINK
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            LINK DRIVE FOLDER
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-secondary-text text-lg leading-relaxed border-t border-border pt-6">
                    {campaign.description || "No mission briefing available."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Sessions List */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-heading text-primary-text flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-accent-green" />
                                MISSION LOGS
                            </h2>
                            {isGM && (
                                <Link to={`/create-session?campaignId=${campaignId}`}>
                                    <CyberButton tag="OP_NEW" size="small">
                                        NEW SESSION
                                    </CyberButton>
                                </Link>
                            )}
                        </div>

                        <div className="space-y-4">
                            {sessions.map(session => (
                                <Link
                                    key={session.id}
                                    to={`/sessions/${session.id}`}
                                    className="block border border-border bg-panel-background/30 p-4 hover:bg-accent-green/5 transition-all group rounded-sm"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-primary-text group-hover:text-accent-green transition-colors">
                                                {session.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-secondary-text mt-1">
                                                <span>{session.finalDate || 'SCHEDULING...'}</span>
                                                <span className={`px-2 py-0.5 text-xs border ${session.status === 'finalized' ? 'border-accent-green text-accent-green' : 'border-accent-amber text-accent-amber'
                                                    }`}>
                                                    {session.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-secondary-text group-hover:text-accent-green transition-colors" />
                                    </div>
                                </Link>
                            ))}
                            {sessions.length === 0 && (
                                <div className="text-center py-10 border border-dashed border-border text-secondary-text">
                                    NO MISSIONS LOGGED.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NPCs */}
                    {isGM && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-heading text-primary-text flex items-center gap-2">
                                    <Users className="w-6 h-6 text-accent-green" />
                                    PERSONNEL FILES
                                </h2>
                                <Link
                                    to={`/campaigns/${campaignId}/npcs/new`}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent-green text-background font-bold hover:bg-primary-text transition-all rounded-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    NEW NPC
                                </Link>
                            </div>
                            <NPCManager campaignId={campaignId} clues={clues} />
                        </div>
                    )}

                    {/* Clues */}
                    {isGM && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-heading text-primary-text flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-accent-green" />
                                    INTEL REPORTS
                                </h2>
                                <Link
                                    to={`/campaigns/${campaignId}/clues/new`}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent-green text-background font-bold hover:bg-primary-text transition-all rounded-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    NEW CLUE
                                </Link>
                            </div>
                            <ClueManager campaignId={campaignId} />
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Campaign Drive */}
                    <div>
                        <h3 className="text-xl font-heading text-primary-text flex items-center gap-2 mb-4">
                            <HardDrive className="w-5 h-5 text-accent-green" />
                            SECURE DRIVE
                        </h3>
                        {campaign.driveFolderId ? (
                            <div className="border border-border bg-panel-background/30 p-4 rounded-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-secondary-text text-sm flex items-center gap-2">
                                        <FolderOpen className="w-4 h-4 text-accent-green" />
                                        DRIVE FOLDER LINKED
                                    </span>
                                    <a
                                        href={`https://drive.google.com/drive/folders/${campaign.driveFolderId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-red hover:underline text-sm flex items-center gap-1"
                                    >
                                        OPEN <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <DriveBrowser campaignId={campaignId} driveFolderId={campaign.driveFolderId} />
                            </div>
                        ) : (
                            <div className="text-center py-6 border border-dashed border-border text-secondary-text">
                                NO DRIVE FOLDER LINKED.
                            </div>
                        )}
                    </div>

                    {/* Active Agents */}
                    <div>
                        <h3 className="text-xl font-heading text-primary-text flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-accent-green" />
                            ACTIVE AGENTS
                        </h3>
                        <div className="space-y-3">
                            {campaign.players?.map(playerId => (
                                <div key={playerId} className="flex items-center gap-3 p-2 bg-panel-background/50 border border-border rounded-sm">
                                    <div className="w-8 h-8 bg-accent-red/20 flex items-center justify-center text-accent-red font-bold rounded-sm">
                                        ?
                                    </div>
                                    <span className="text-secondary-text text-sm">Agent {playerId.slice(0, 6)}...</span>
                                </div>
                            ))}
                            <button className="w-full py-2 border border-dashed border-border text-secondary-text text-sm hover:border-accent-red hover:text-accent-red transition-all mt-4 rounded-sm">
                                + INVITE AGENT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
