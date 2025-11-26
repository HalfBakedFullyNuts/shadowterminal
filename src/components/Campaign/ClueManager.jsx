import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { addRecentItem } from '../../lib/recentItems';

export default function ClueManager({ campaignId, isGM }) {
    const [clues, setClues] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'Intel',
        isRevealed: false
    });

    useEffect(() => {
        if (!campaignId) return;
        const q = query(collection(db, `campaigns/${campaignId}/clues`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setClues(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, [campaignId]);

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            type: 'Intel',
            isRevealed: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, `campaigns/${campaignId}/clues`, editingId), formData);
            } else {
                await addDoc(collection(db, `campaigns/${campaignId}/clues`), formData);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving clue:", error);
            alert("Failed to save clue.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this clue?")) return;
        try {
            await deleteDoc(doc(db, `campaigns/${campaignId}/clues`, id));
        } catch (error) {
            console.error("Error deleting clue:", error);
        }
    };

    const handleEdit = (clue) => {
        setFormData(clue);
        setEditingId(clue.id);
        setShowForm(true);
    };

    const toggleReveal = async (clue) => {
        try {
            await updateDoc(doc(db, `campaigns/${campaignId}/clues`, clue.id), {
                isRevealed: !clue.isRevealed
            });
        } catch (error) {
            console.error("Error toggling reveal:", error);
        }
    };

    const visibleClues = isGM ? clues : clues.filter(c => c.isRevealed);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-heading text-accent-amber flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    INTEL & CLUES
                </h3>
                {isGM && (
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="flex items-center gap-2 px-3 py-1 bg-accent-amber/20 border border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-background transition-all text-sm rounded-sm"
                    >
                        <Plus className="w-4 h-4" />
                        {showForm ? 'CANCEL' : 'ADD INTEL'}
                    </button>
                )}
            </div>

            {isGM && showForm && (
                <form onSubmit={handleSave} className="border border-border bg-panel-background/50 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 rounded-sm">
                    <input
                        type="text"
                        placeholder="Subject / Title"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="bg-background border border-border p-2 text-primary-text w-full focus:border-accent-amber outline-none rounded-sm"
                    />

                    <div className="flex gap-4">
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="bg-background border border-border p-2 text-primary-text focus:border-accent-amber outline-none rounded-sm"
                        >
                            <option value="Intel">Intel</option>
                            <option value="Intercept">Intercept</option>
                            <option value="Physical">Physical Evidence</option>
                            <option value="Note">GM Note</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isRevealed"
                                checked={formData.isRevealed}
                                onChange={e => setFormData({ ...formData, isRevealed: e.target.checked })}
                                className="w-4 h-4 accent-accent-amber"
                            />
                            <label htmlFor="isRevealed" className="text-secondary-text text-sm">Revealed to Players</label>
                        </div>
                    </div>

                    <textarea
                        placeholder="Content..."
                        required
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="bg-background border border-border p-2 text-primary-text w-full h-32 focus:border-accent-amber outline-none font-mono text-sm rounded-sm"
                    />

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
                            className="px-6 py-2 bg-accent-amber text-background font-bold hover:bg-accent-amber/80 rounded-sm"
                        >
                            UPLOAD INTEL
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 gap-4">
                {visibleClues.map(clue => (
                    <div
                        key={clue.id}
                        onClick={() => addRecentItem({ ...clue, type: 'clue' })}
                        className={`border border-border p-4 bg-panel-background/30 relative group cursor-pointer hover:bg-accent-green/5 transition-colors rounded-sm ${!clue.isRevealed && isGM ? 'opacity-70 border-dashed' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-xs border rounded-sm ${clue.type === 'Intel' ? 'border-accent-green text-accent-green' :
                                    clue.type === 'Intercept' ? 'border-accent-red text-accent-red' :
                                        'border-accent-amber text-accent-amber'
                                    }`}>
                                    {clue.type.toUpperCase()}
                                </span>
                                <h4 className="text-lg font-bold text-primary-text">
                                    {clue.title}
                                </h4>
                                {!clue.isRevealed && isGM && <Lock className="w-4 h-4 text-secondary-text/70" />}
                            </div>

                            {isGM && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => toggleReveal(clue)} title="Toggle Reveal">
                                        {clue.isRevealed ? <Unlock className="w-4 h-4 text-accent-amber" /> : <Lock className="w-4 h-4 text-secondary-text/70" />}
                                    </button>
                                    <button onClick={() => handleEdit(clue)} title="Edit">
                                        <Edit className="w-4 h-4 text-accent-green" />
                                    </button>
                                    <button onClick={() => handleDelete(clue.id)} title="Delete">
                                        <Trash2 className="w-4 h-4 text-accent-red" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-secondary-text font-mono text-sm whitespace-pre-wrap border-l-2 border-border pl-3">
                            {clue.content}
                        </p>
                    </div>
                ))}
                {visibleClues.length === 0 && (
                    <div className="text-center py-8 text-secondary-text border border-dashed border-border rounded-sm">
                        NO INTEL AVAILABLE.
                    </div>
                )}
            </div>
        </div>
    );
}
