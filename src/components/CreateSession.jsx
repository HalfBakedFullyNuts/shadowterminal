import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Globe, Users, RefreshCw, Plus, X, Shield } from 'lucide-react';
import { generateRecurringDates, formatDate, getISOWeek } from '../lib/dateUtils';
import CyberButton from './CyberButton';

export default function CreateSession() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'in-person',
        location: '',
        customLocation: '',
        campaignId: searchParams.get('campaignId') || ''
    });

    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const q = query(collection(db, 'campaigns'), where('gmId', '==', currentUser.uid));
            const snapshot = await getDocs(q);
            setCampaigns(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        fetchCampaigns();
    }, [currentUser]);

    const campaignIdParam = searchParams.get('campaignId');
    useEffect(() => {
        if (campaignIdParam) {
            setFormData(prev => ({ ...prev, campaignId: campaignIdParam }));
        }
    }, [campaignIdParam]);

    const [selectedDates, setSelectedDates] = useState(new Set());
    const [recurrence, setRecurrence] = useState({
        enabled: false,
        dayOfWeek: 5, // Friday
        weekNumber: 3, // 3rd
        months: 6
    });

    const locations = ['The Citadel', 'Neon District HQ', 'Underground Bunker', 'Virtual Space'];

    const toggleDate = (dateStr) => {
        const newDates = new Set(selectedDates);
        if (newDates.has(dateStr)) {
            newDates.delete(dateStr);
        } else {
            newDates.add(dateStr);
        }
        setSelectedDates(newDates);
    };

    const handleGenerateRecurring = () => {
        const dates = generateRecurringDates(new Date(), recurrence.months, recurrence.dayOfWeek, recurrence.weekNumber);
        const newDates = new Set(selectedDates);
        dates.forEach(d => newDates.add(formatDate(d)));
        setSelectedDates(newDates);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check for conflicts with existing finalized sessions
            const q = query(collection(db, 'sessions'), where('status', '==', 'finalized'));
            const snapshot = await getDocs(q);
            const finalizedWeeks = new Set(snapshot.docs.map(d => {
                const data = d.data();
                return data.finalDate ? getISOWeek(new Date(data.finalDate)) : null;
            }).filter(Boolean));

            const proposedWeeks = new Set(Array.from(selectedDates).map(d => getISOWeek(new Date(d))));
            const conflicts = [...proposedWeeks].filter(w => finalizedWeeks.has(w));

            if (conflicts.length > 0) {
                const proceed = window.confirm(`WARNING: Operations already scheduled for weeks: ${conflicts.join(', ')}. Protocol suggests one operation per week. Proceed anyway?`);
                if (!proceed) {
                    setLoading(false);
                    return;
                }
            }

            await addDoc(collection(db, 'sessions'), {
                ...formData,
                proposedDates: Array.from(selectedDates),
                createdBy: currentUser.uid,
                createdAt: serverTimestamp(),
                status: 'open',
                participants: [currentUser.uid]
            });
            navigate('/');
        } catch (error) {
            console.error("Error creating session:", error);
            setLoading(false);
        }
    };

    return (
        <div className="cyber-border bg-cyber-gray/50 backdrop-blur-md p-8">
            <h2 className="text-2xl font-orbitron text-cyber-cyan mb-6 flex items-center gap-3">
                <Plus className="w-6 h-6" />
                INITIATE NEW SESSION
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-cyber-cyan/70 text-sm mb-2 font-orbitron">OPERATION TITLE</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-cyber-dark/50 border border-cyber-cyan/30 p-3 text-white focus:border-cyber-cyan focus:box-glow outline-none transition-all"
                                placeholder="e.g. The Heist of Century City"
                            />
                        </div>

                        <div>
                            <label className="block text-cyber-cyan/70 text-sm mb-2 font-orbitron">MISSION BRIEF</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-cyber-dark/50 border border-cyber-cyan/30 p-3 text-white focus:border-cyber-cyan focus:box-glow outline-none transition-all h-32"
                                placeholder="Briefing details..."
                            />
                        </div>
                    </div>

                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-cyber-cyan/70 text-sm mb-2 font-orbitron">CAMPAIGN (OPTIONAL)</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <select
                                value={formData.campaignId}
                                onChange={e => setFormData({ ...formData, campaignId: e.target.value })}
                                className="w-full bg-cyber-dark/50 border border-cyber-cyan/30 p-3 pl-10 text-white focus:border-cyber-cyan outline-none"
                            >
                                <option value="">Independent Operation</option>
                                {campaigns.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-cyber-cyan/70 text-sm mb-2 font-orbitron">PROTOCOL TYPE</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'in-person' })}
                                className={`flex-1 p-3 border transition-all flex items-center justify-center gap-2 ${formData.type === 'in-person'
                                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan box-glow'
                                    : 'border-cyber-cyan/30 text-gray-400 hover:bg-cyber-cyan/5'
                                    }`}
                            >
                                <Users className="w-4 h-4" /> IN-PERSON
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'online' })}
                                className={`flex-1 p-3 border transition-all flex items-center justify-center gap-2 ${formData.type === 'online'
                                    ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta box-glow'
                                    : 'border-cyber-magenta/30 text-gray-400 hover:bg-cyber-magenta/5'
                                    }`}
                            >
                                <Globe className="w-4 h-4" /> ONLINE
                            </button>
                        </div>
                    </div>

                    {formData.type === 'in-person' && (
                        <div className="animate-in fade-in duration-300">
                            <label className="block text-cyber-cyan/70 text-sm mb-2 font-orbitron">COORDINATES</label>
                            <select
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-cyber-dark/50 border border-cyber-cyan/30 p-3 text-white focus:border-cyber-cyan outline-none mb-2"
                            >
                                <option value="">Select Location...</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                <option value="custom">Custom Coordinates...</option>
                            </select>

                            {formData.location === 'custom' && (
                                <input
                                    type="text"
                                    value={formData.customLocation}
                                    onChange={e => setFormData({ ...formData, customLocation: e.target.value })}
                                    className="w-full bg-cyber-dark/50 border border-cyber-cyan/30 p-3 text-white focus:border-cyber-cyan outline-none"
                                    placeholder="Enter custom location"
                                />
                            )}
                        </div>
                    )}
                </div>


                {/* Date Selection */}
                <div className="border-t border-cyber-cyan/20 pt-6">
                    <h3 className="text-xl font-orbitron text-cyber-yellow mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> TEMPORAL COORDINATES
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Generator */}
                        <div className="bg-cyber-dark/30 p-4 border border-cyber-cyan/20">
                            <h4 className="text-sm font-orbitron text-cyber-cyan mb-4 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> AUTO-GENERATOR
                            </h4>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <label className="block text-gray-400 mb-1">Frequency</label>
                                    <select
                                        className="w-full bg-cyber-dark border border-gray-700 p-2"
                                        value={recurrence.weekNumber}
                                        onChange={e => setRecurrence({ ...recurrence, weekNumber: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1st</option>
                                        <option value={2}>2nd</option>
                                        <option value={3}>3rd</option>
                                        <option value={4}>4th</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-1">Day</label>
                                    <select
                                        className="w-full bg-cyber-dark border border-gray-700 p-2"
                                        value={recurrence.dayOfWeek}
                                        onChange={e => setRecurrence({ ...recurrence, dayOfWeek: parseInt(e.target.value) })}
                                    >
                                        <option value={5}>Friday</option>
                                        <option value={6}>Saturday</option>
                                        <option value={0}>Sunday</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGenerateRecurring}
                                    className="w-full py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 transition-colors"
                                >
                                    GENERATE DATES
                                </button>
                            </div>
                        </div>

                        {/* Selected Dates List */}
                        <div className="md:col-span-2">
                            <div className="flex flex-wrap gap-2">
                                {Array.from(selectedDates).sort().map(date => (
                                    <div key={date} className="flex items-center gap-2 bg-cyber-cyan/10 border border-cyber-cyan/30 px-3 py-1 rounded-sm group hover:border-cyber-magenta/50 transition-colors">
                                        <span className="font-mono text-cyber-cyan group-hover:text-cyber-magenta">{date}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleDate(date)}
                                            className="text-cyber-cyan/50 hover:text-cyber-magenta"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {selectedDates.size === 0 && (
                                    <p className="text-gray-500 italic">No dates selected. Use the generator or add manually.</p>
                                )}
                            </div>

                            <div className="mt-4">
                                <input
                                    type="date"
                                    className="bg-cyber-dark border border-gray-700 p-2 text-white"
                                    onChange={(e) => {
                                        if (e.target.value) toggleDate(e.target.value);
                                    }}
                                />
                                <span className="ml-2 text-sm text-gray-500">Select to add single date</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-cyber-cyan/20">
                    <CyberButton
                        type="submit"
                        disabled={loading || selectedDates.size === 0}
                        tag="EXECUTE"
                    >
                        {loading ? 'TRANSMITTING...' : 'INITIATE SESSION'}
                    </CyberButton>
                </div>
            </form >
        </div >
    );
}
