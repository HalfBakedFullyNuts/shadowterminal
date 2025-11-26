import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { Users, UserPlus, Edit, Trash2, Eye, EyeOff, MapPin, Link as LinkIcon, FileText } from 'lucide-react';
import { addRecentItem } from '../../lib/recentItems';

export default function NPCManager({ campaignId, isGM, players, sessions, clues }) {
    const [npcs, setNpcs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        shortDescription: '',
        description: '',
        location: '',
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

    // Filter NPCs for players
    const visibleNpcs = isGM ? npcs : npcs.filter(n => n.isPublic);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-heading text-accent-red flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    PERSONNEL DATABASE
                </h3>
                {isGM && (
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="flex items-center gap-2 px-3 py-1 bg-accent-red/20 border border-accent-red text-accent-red hover:bg-accent-red hover:text-primary-text transition-all text-sm rounded-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        {showForm ? 'CANCEL' : 'ADD NPC'}
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

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 text-secondary-text hover:text-primary-text"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-accent-red text-primary-text font-bold hover:bg-accent-red/80 rounded-sm"
                        >
                            SAVE RECORD
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleNpcs.map(npc => (
                    <div
                        key={npc.id}
                        onClick={() => addRecentItem({ ...npc, type: 'npc' })}
                        className={`border border-border p-4 bg-panel-background/30 relative group cursor-pointer hover:bg-accent-red/5 transition-colors rounded-sm ${!npc.isPublic && isGM ? 'opacity-70 border-dashed' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-bold text-primary-text flex items-center gap-2">
                                    {npc.name}
                                    {!npc.isPublic && isGM && <EyeOff className="w-4 h-4 text-secondary-text" />}
                                </h4>
                                <p className="text-accent-red text-sm font-mono uppercase">{npc.role}</p>
                            </div>
                            {isGM && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => togglePublic(npc)} title="Toggle Visibility">
                                        {npc.isPublic ? <Eye className="w-4 h-4 text-accent-green" /> : <EyeOff className="w-4 h-4 text-secondary-text" />}
                                    </button>
                                    <button onClick={() => handleEdit(npc)} title="Edit">
                                        <Edit className="w-4 h-4 text-accent-amber" />
                                    </button>
                                    <button onClick={() => handleDelete(npc.id)} title="Delete">
                                        <Trash2 className="w-4 h-4 text-accent-red" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-secondary-text text-sm mt-2 italic">{npc.shortDescription}</p>

                        {npc.location && (
                            <div className="flex items-center gap-1 text-xs text-secondary-text/70 mt-2">
                                <MapPin className="w-3 h-3" />
                                {npc.location}
                            </div>
                        )}

                        {/* GM Only Details */}
                        {isGM && (
                            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text/70 space-y-1">
                                <p className="line-clamp-2">{npc.description}</p>
                                {npc.connections?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {npc.connections.map((c, i) => (
                                            <span key={i} className="bg-panel-background px-1 rounded-sm">
                                                Ag.{c.pcId.slice(0, 4)}: C{c.connectionRating}/L{c.loyaltyRating}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {visibleNpcs.length === 0 && (
                    <div className="col-span-full text-center py-8 text-secondary-text border border-dashed border-border rounded-sm">
                        NO RECORDS FOUND.
                    </div>
                )}
            </div>
        </div>
    );
}
