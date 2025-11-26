import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Folder, Plus, Users, Shield, HardDrive } from 'lucide-react';

export default function CampaignList() {
    const { currentUser } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        if (!currentUser) return;

        // Query campaigns where user is GM or a player
        // Firestore doesn't support logical OR in queries easily, so we might need two listeners or client-side filter
        // For now, let's just fetch all and filter client-side for simplicity in this prototype, 
        // or better: fetch where gmId == uid AND where players array-contains uid

        const q = query(collection(db, 'campaigns'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allCampaigns = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter visible campaigns
            const myCampaigns = allCampaigns.filter(c =>
                c.gmId === currentUser.uid ||
                (c.players && c.players.includes(currentUser.uid))
            );

            setCampaigns(myCampaigns);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await addDoc(collection(db, 'campaigns'), {
                title: newTitle,
                description: newDesc,
                gmId: currentUser.uid,
                gmName: currentUser.displayName || 'Unknown GM',
                players: [currentUser.uid], // GM is also a participant usually
                createdAt: serverTimestamp(),
                driveFolderId: null
            });
            setShowCreate(false);
            setNewTitle('');
            setNewDesc('');
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    if (loading) return <div className="text-cyber-cyan animate-pulse p-8">SCANNING NETWORK FOR CAMPAIGNS...</div>;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-orbitron text-white text-glow flex items-center gap-3">
                    <Shield className="w-8 h-8 text-cyber-magenta" />
                    ACTIVE CAMPAIGNS
                </h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-cyber-cyan text-cyber-dark font-bold py-2 px-4 clip-path-slant hover:bg-white transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> NEW OPERATION
                </button>
            </div>

            {showCreate && (
                <div className="cyber-border bg-cyber-gray/50 p-6 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-orbitron text-cyber-cyan mb-4">INITIATE NEW CAMPAIGN</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">CAMPAIGN TITLE</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                className="w-full bg-cyber-dark border border-cyber-cyan/30 p-2 text-white focus:border-cyber-cyan outline-none"
                                placeholder="e.g. The Seattle Sprawl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">MISSION BRIEFING (DESCRIPTION)</label>
                            <textarea
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                className="w-full bg-cyber-dark border border-cyber-cyan/30 p-2 text-white focus:border-cyber-cyan outline-none h-24"
                                placeholder="Brief description of the campaign setting and goals..."
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowCreate(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="bg-cyber-magenta/20 border border-cyber-magenta text-cyber-magenta px-6 py-2 hover:bg-cyber-magenta hover:text-white transition-all"
                            >
                                LAUNCH
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className="group relative block bg-cyber-dark/50 border border-cyber-cyan/20 hover:border-cyber-cyan transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <Folder className="w-8 h-8 text-cyber-cyan group-hover:text-cyber-yellow transition-colors" />
                                {campaign.gmId === currentUser.uid && (
                                    <span className="text-xs border border-cyber-magenta text-cyber-magenta px-2 py-0.5 rounded-sm">GM ACCESS</span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors truncate">
                                {campaign.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                {campaign.description || 'No briefing available.'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 font-mono border-t border-gray-800 pt-4">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{campaign.players?.length || 0} AGENTS</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    <span>{campaign.driveFolderId ? 'LINKED' : 'OFFLINE'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {campaigns.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 border border-dashed border-gray-700 text-gray-500">
                        NO ACTIVE CAMPAIGNS DETECTED. INITIATE NEW OPERATION.
                    </div>
                )}
            </div>
        </div>
    );
}
