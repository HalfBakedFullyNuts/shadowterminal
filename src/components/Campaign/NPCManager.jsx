import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { Users, UserPlus, Edit, Trash2, Eye, EyeOff, MapPin, Link as LinkIcon, FileText, Search, Plus } from 'lucide-react';
import { addRecentItem } from '../../lib/recentItems';
import CyberButton from '../CyberButton';
import { useGlitch } from '../../hooks/useGlitch';

export default function NPCManager({ campaignId, isGM, players, sessions, clues }) {
    const [npcs, setNpcs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { triggerGlitch, glitchClass } = useGlitch();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        shortDescription: '',
        description: '',
        location: '',
        faction: '',
        status: 'Active',
        isPublic: false,
        connections: [], // { pcId, connectionRating, loyaltyRating }
        appearedInSessions: [],
        cluesHeld: []
    });

    useEffect(() => {
        if (!campaignId) return;
        const q = query(collection(db, `campaigns/${campaignId}/npcs`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNpcs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, [campaignId]);

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            shortDescription: '',
            description: '',
            location: '',
            faction: '',
            status: 'Active',
            isPublic: false,
            connections: [],
            appearedInSessions: [],
            cluesHeld: []
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, `campaigns/${campaignId}/npcs`, editingId), formData);
            } else {
                await addDoc(collection(db, `campaigns/${campaignId}/npcs`), formData);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving NPC:", error);
            alert("Failed to save NPC.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this NPC?")) return;
        try {
            await deleteDoc(doc(db, `campaigns/${campaignId}/npcs`, id));
        } catch (error) {
            console.error("Error deleting NPC:", error);
        }
    };

    const handleEdit = (npc) => {
        setFormData(npc);
        setEditingId(npc.id);
        setShowForm(true);
    };

    const togglePublic = async (npc) => {
        try {
            await updateDoc(doc(db, `campaigns/${campaignId}/npcs`, npc.id), {
                isPublic: !npc.isPublic
            });
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    // Connection Helper
    const updateConnection = (pcId, field, value) => {
        const current = [...formData.connections];
        const index = current.findIndex(c => c.pcId === pcId);

        if (index >= 0) {
            current[index] = { ...current[index], [field]: parseInt(value) || 0 };
        } else {
            current.push({ pcId, connectionRating: 0, loyaltyRating: 0, [field]: parseInt(value) || 0 });
        }
        // Filter out empty connections if both ratings are 0? Maybe keep them.
        setFormData({ ...formData, connections: current });
    };

    const getConnection = (pcId) => {
        return formData.connections.find(c => c.pcId === pcId) || { connectionRating: 0, loyaltyRating: 0 };
    };

    // Filter NPCs for players and search
    const visibleNpcs = (isGM ? npcs : npcs.filter(n => n.isPublic)).filter(npc => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            npc.name?.toLowerCase().includes(q) ||
            npc.role?.toLowerCase().includes(q) ||
            npc.faction?.toLowerCase().includes(q)
        );
    });

    // Status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-accent-green';
            case 'Inactive': return 'text-gray-400';
            case 'Deceased': return 'text-accent-red';
            default: return 'text-secondary-text';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'Active': return 'bg-accent-green';
            case 'Inactive': return 'bg-gray-400';
            case 'Deceased': return 'bg-accent-red';
            default: return 'bg-secondary-text';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header>
                <h2 className="font-heading text-primary-text text-3xl font-bold leading-tight tracking-wide uppercase">
                    NPC Manager
                </h2>
                <p className="font-body text-secondary-text text-base">
                    Personnel database for campaign contacts
                </p>
            </header>

            {/* Search Bar & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-grow max-w-lg">
                    <div className="flex w-full items-stretch rounded-sm h-12 border border-border bg-panel-background focus-within:border-accent-green focus-within:shadow-[0_0_8px_var(--color-glow-green)] transition-all duration-300">
                        <div className="text-secondary-text flex items-center justify-center pl-4">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            className="flex w-full min-w-0 flex-1 text-primary-text focus:outline-none border-none bg-transparent h-full placeholder:text-secondary-text px-4 text-base font-body"
                            placeholder="Search by Name, Role, or Faction..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                {isGM && (
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); triggerGlitch(); }}
                        onMouseEnter={triggerGlitch}
                        className={`flex items-center justify-center gap-2 h-12 px-6 rounded-sm font-heading font-semibold bg-accent-green text-background hover:opacity-90 transition-opacity ${glitchClass}`}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="uppercase tracking-wider">{showForm ? 'Cancel' : 'Create NPC'}</span>
                    </button>
                )}
            </div>

            {isGM && showForm && (
                <form onSubmit={handleSave} className="border border-border bg-panel-background/50 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-background border border-border p-2 text-primary-text w-full focus:border-accent-red outline-none rounded-sm"
                        />
                        <input
                            type="text"
                            placeholder="Role (e.g. Fixer, Corp Exec)"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="bg-background border border-border p-2 text-primary-text w-full focus:border-accent-red outline-none rounded-sm"
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="bg-background border border-border p-2 text-primary-text w-full focus:border-accent-red outline-none rounded-sm"
                        />
                        <input
                            type="text"
                            placeholder="Short Description / Tagline"
                            value={formData.shortDescription}
                            onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                            className="bg-background border border-border p-2 text-primary-text w-full focus:border-accent-red outline-none rounded-sm"
                        />
                    </div>

                    <textarea
                        placeholder="Full Description / Bio (GM Notes)"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="bg-background border border-border p-2 text-primary-text w-full h-24 focus:border-accent-red outline-none rounded-sm"
                    />

                    {/* Connections */}
                    <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-heading text-secondary-text mb-2">CONNECTIONS</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {players?.map(player => {
                                const conn = getConnection(player); // player is uid string based on current data model
                                return (
                                    <div key={player} className="flex items-center gap-2 text-sm">
                                        <span className="w-24 text-secondary-text truncate">Agent {player.slice(0, 6)}</span>
                                        <input
                                            type="number"
                                            placeholder="Conn"
                                            className="w-16 bg-background border border-border p-1 text-primary-text rounded-sm"
                                            value={conn.connectionRating || ''}
                                            onChange={e => updateConnection(player, 'connectionRating', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Loyalty"
                                            className="w-16 bg-background border border-border p-1 text-primary-text rounded-sm"
                                            value={conn.loyaltyRating || ''}
                                            onChange={e => updateConnection(player, 'loyaltyRating', e.target.value)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                        <div>
                            <h4 className="text-sm font-heading text-secondary-text mb-2">APPEARED IN SESSIONS</h4>
                            <select
                                multiple
                                className="w-full bg-background border border-border p-2 text-primary-text h-24 rounded-sm"
                                value={formData.appearedInSessions}
                                onChange={e => setFormData({ ...formData, appearedInSessions: Array.from(e.target.selectedOptions, option => option.value) })}
                            >
                                {sessions.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                            <p className="text-xs text-secondary-text/70 mt-1">Hold Ctrl to select multiple</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-heading text-secondary-text mb-2">CLUES HELD</h4>
                            <select
                                multiple
                                className="w-full bg-background border border-border p-2 text-primary-text h-24 rounded-sm"
                                value={formData.cluesHeld}
                                onChange={e => setFormData({ ...formData, cluesHeld: Array.from(e.target.selectedOptions, option => option.value) })}
                            >
                                {clues.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="w-4 h-4 accent-accent-red"
                        />
                        <label htmlFor="isPublic" className="text-secondary-text text-sm">Visible to Players</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 text-secondary-text hover:text-primary-text"
                        >
                            CANCEL
                        </button>
                        <CyberButton
                            type="submit"
                            tag="SAVE_REC"
                            className="w-64"
                            style={{ '--primary-hue': 0, '--shadow-primary-hue': 180 }}
                        >
                            SAVE RECORD
                        </CyberButton>
                    </div>
                </form>
            )}

            {/* NPC Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleNpcs.map(npc => (
                    <div
                        key={npc.id}
                        onClick={() => addRecentItem({ ...npc, type: 'npc' })}
                        className={`flex flex-col justify-between rounded-sm bg-panel-background border border-border p-5 gap-4 cursor-pointer hover:border-accent-green/50 hover:shadow-[0_0_8px_var(--color-glow-green)] transition-all duration-300 ${!npc.isPublic && isGM ? 'opacity-70 border-dashed' : ''}`}
                    >
                        <div className="flex flex-col gap-2">
                            {/* Header with name and status */}
                            <div className="flex justify-between items-start">
                                <h3 className="font-heading text-xl font-bold text-primary-text">
                                    {npc.name}
                                    {!npc.isPublic && isGM && <EyeOff className="w-4 h-4 text-secondary-text inline ml-2" />}
                                </h3>
                                <div className={`flex items-center gap-2 text-xs font-medium ${getStatusColor(npc.status || 'Active')}`}>
                                    <div className={`w-2 h-2 rounded-full ${getStatusDot(npc.status || 'Active')}`}></div>
                                    <span>{npc.status || 'Active'}</span>
                                </div>
                            </div>

                            {/* Role */}
                            <p className="font-body text-secondary-text">
                                Role: <span className="text-primary-text/80">{npc.role || 'Unknown'}</span>
                            </p>

                            {/* Faction */}
                            <p className="font-body text-secondary-text">
                                Faction: <span className="text-primary-text/80">{npc.faction || 'Independent'}</span>
                            </p>

                            {/* Short Description */}
                            {npc.shortDescription && (
                                <p className="text-secondary-text text-sm mt-1 italic line-clamp-2">{npc.shortDescription}</p>
                            )}
                        </div>

                        {/* Action buttons - GM only */}
                        {isGM && (
                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePublic(npc); }}
                                    title="Toggle Visibility"
                                    className="flex items-center justify-center p-2 rounded-sm hover:bg-accent-green/10 transition-colors"
                                >
                                    {npc.isPublic ? <Eye className="w-4 h-4 text-accent-green" /> : <EyeOff className="w-4 h-4 text-secondary-text" />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(npc); }}
                                    title="Edit"
                                    className="flex items-center justify-center p-2 rounded-sm text-accent-amber hover:bg-accent-amber/10 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(npc.id); }}
                                    title="Delete"
                                    className="flex items-center justify-center p-2 rounded-sm text-accent-red hover:bg-accent-red/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Empty State */}
                {visibleNpcs.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 p-10 rounded-sm border-2 border-dashed border-border text-center min-h-[200px]">
                        <Users className="w-12 h-12 text-secondary-text" />
                        <h3 className="font-heading text-2xl text-primary-text">No NPCs Found</h3>
                        <p className="text-secondary-text max-w-sm">
                            {searchQuery ? 'No matches for your search. Try different keywords.' : 'Your campaign is looking empty. Time to populate the shadows.'}
                        </p>
                        {isGM && !searchQuery && (
                            <button
                                onClick={() => { resetForm(); setShowForm(true); }}
                                className="mt-2 flex items-center justify-center gap-2 h-12 px-6 rounded-sm font-heading font-semibold bg-accent-green text-background hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="uppercase tracking-wider">Create Your First NPC</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
