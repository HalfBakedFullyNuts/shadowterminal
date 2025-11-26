import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, Zap, Brain, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RunnerStatus() {
    const { currentUser } = useAuth();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!currentUser) return;
            try {
                // Fetch most recently modified character
                // Note: Requires 'updatedAt' field, falling back to basic query if not present
                const q = query(
                    collection(db, 'characters'),
                    where('userId', '==', currentUser.uid),
                    // orderBy('updatedAt', 'desc'), // Add index if needed
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setCharacter({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                }
            } catch (error) {
                console.error("Error fetching runner status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacter();
    }, [currentUser]);

    if (loading) return <div className="animate-pulse h-64 bg-cyber-dark/30 cyber-border"></div>;
    if (!character) return null;

    // Helper to get top 3 items
    const getTop3 = (obj) => {
        if (!obj) return [];
        return Object.entries(obj)
            .filter(([, val]) => val && typeof val === 'object') // Filter out nulls/primitives
            .sort(([, a], [, b]) => {
                const valB = b?.total || b?.rating || 0;
                const valA = a?.total || a?.rating || 0;
                return valB - valA;
            })
            .slice(0, 3);
    };

    const topAttributes = getTop3(character.attributes);
    const topSkills = getTop3(character.skills?.active);

    // Helper to safely render stats that might be objects (e.g. { current, total })
    const renderStat = (val) => {
        if (val && typeof val === 'object') {
            return val.total || val.current || val.rating || 0;
        }
        return val || 0;
    };

    return (
        <div className="border border-border bg-panel-background/50 p-6 space-y-6 h-full rounded-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-heading text-accent-amber flex items-center gap-2">
                        <User className="w-5 h-5" /> ASSET OVERVIEW
                    </h3>
                    <div className="text-sm text-secondary-text font-mono mt-1">
                        ID: {character.name?.toUpperCase() || 'UNKNOWN'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-accent-green border border-accent-green/30 px-2 py-1 rounded-sm">
                        {character.archetype || 'FREELANCER'}
                    </div>
                </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 p-3 border-l-2 border-accent-green rounded-r-sm">
                    <div className="text-xs text-secondary-text mb-1">NUYEN</div>
                    <div className="text-xl font-mono text-primary-text">¥{renderStat(character.nuyen).toLocaleString()}</div>
                </div>
                <div className="bg-background/40 p-3 border-l-2 border-accent-red rounded-r-sm">
                    <div className="text-xs text-secondary-text mb-1">KARMA</div>
                    <div className="text-xl font-mono text-primary-text">{renderStat(character.karma)}</div>
                </div>
                <div className="bg-background/40 p-3 border-l-2 border-accent-amber rounded-r-sm">
                    <div className="text-xs text-secondary-text mb-1">STREET CRED</div>
                    <div className="text-xl font-mono text-primary-text">{renderStat(character.streetCred)}</div>
                </div>
                <div className="bg-background/40 p-3 border-l-2 border-accent-red rounded-r-sm">
                    <div className="text-xs text-secondary-text mb-1">NOTORIETY</div>
                    <div className="text-xl font-mono text-primary-text">{renderStat(character.notoriety)}</div>
                </div>
            </div>

            {/* Top Attributes */}
            <div>
                <h4 className="text-sm font-heading text-accent-green mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> TOP ATTRIBUTES
                </h4>
                <div className="flex flex-wrap gap-2">
                    {topAttributes.map(([key, attr]) => (
                        <div key={key} className="px-2 py-1 bg-accent-green/10 border border-accent-green/30 text-xs text-accent-green rounded-sm">
                            {key.toUpperCase().slice(0, 3)}: <span className="text-primary-text font-bold">{attr.total || attr.base}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Skills */}
            <div>
                <h4 className="text-sm font-heading text-accent-red mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> SPECIALIZATIONS
                </h4>
                <div className="space-y-1">
                    {topSkills.map(([key, skill]) => (
                        <div key={key} className="flex justify-between text-sm text-secondary-text border-b border-border pb-1">
                            <span>{skill.name || key}</span>
                            <span className="text-accent-red font-bold">{skill.rating}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {character.notes && (
                <div className="bg-accent-amber/5 border border-accent-amber/20 p-3 relative rounded-sm">
                    <FileText className="absolute top-2 right-2 w-4 h-4 text-accent-amber/50" />
                    <h4 className="text-xs font-bold text-accent-amber mb-1">LATEST NOTES</h4>
                    <p className="text-xs text-secondary-text line-clamp-3 italic">
                        "{character.notes}"
                    </p>
                </div>
            )}

            <Link
                to={`/characters/${character.id}`}
                className="block w-full py-2 text-center bg-background border border-border hover:border-primary-text hover:text-primary-text text-secondary-text transition-all text-sm font-heading rounded-sm"
            >
                FULL DIAGNOSTIC
            </Link>
        </div>
    );
}
