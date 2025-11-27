import React, { useState } from 'react';
import { Brain, Shield, Lock } from 'lucide-react';

export default function NPCProfile({ campaign }) {
    const [selectedNPC, setSelectedNPC] = useState(null);

    // Filter for public NPCs only, unless we want to show a "Redacted" state for private ones
    // The requirement says "NPC can be viewed by players but only if the GM has flagged their profiles as public"
    const publicNPCs = campaign.npcs.filter(npc => npc.isPublic);

    const getFuzzyStat = (value) => {
        if (value <= 1) return { label: 'INEPT', color: 'text-red-500' };
        if (value <= 3) return { label: 'PRACTICED', color: 'text-yellow-500' };
        if (value <= 5) return { label: 'EXPERIENCED', color: 'text-blue-400' };
        if (value === 6) return { label: 'MASTERED', color: 'text-purple-500' };
        return { label: 'EXCEPTIONAL', color: 'text-cyber-magenta' };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NPC List */}
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-orbitron text-cyber-cyan border-b border-gray-800 pb-2">
                    KNOWN CONTACTS
                </h3>
                <div className="space-y-2">
                    {publicNPCs.map(npc => (
                        <div
                            key={npc.id}
                            onClick={() => setSelectedNPC(npc)}
                            className={`p-3 cyber-border cursor-pointer transition-all ${selectedNPC?.id === npc.id
                                    ? 'bg-cyber-cyan/20 border-cyber-cyan'
                                    : 'bg-cyber-dark/30 border-gray-800 hover:border-cyber-cyan/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded-full overflow-hidden">
                                    {npc.image ? (
                                        <img src={npc.image} alt={npc.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">?</div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{npc.name}</div>
                                    <div className="text-xs text-cyber-cyan">{npc.type}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {publicNPCs.length === 0 && (
                        <div className="text-gray-500 italic text-center py-4">NO PUBLIC RECORDS FOUND</div>
                    )}
                </div>
            </div>

            {/* NPC Details */}
            <div className="md:col-span-2">
                {selectedNPC ? (
                    <div className="cyber-border bg-cyber-dark/50 p-6 space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 bg-gray-800 rounded border-2 border-cyber-cyan overflow-hidden flex-shrink-0">
                                {selectedNPC.image ? (
                                    <img src={selectedNPC.image} alt={selectedNPC.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <Brain className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-orbitron text-white">{selectedNPC.name}</h2>
                                <div className="text-cyber-magenta font-rajdhani text-lg mb-2">{selectedNPC.type}</div>
                                <p className="text-gray-300 italic">{selectedNPC.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedNPC.stats).map(([stat, value]) => {
                                const fuzzy = getFuzzyStat(value);
                                return (
                                    <div key={stat} className="bg-black/40 p-3 border-l-2 border-gray-700">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat}</div>
                                        <div className={`font-orbitron font-bold ${fuzzy.color}`}>
                                            {fuzzy.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 border border-dashed border-gray-800 rounded p-8">
                        <Lock className="w-16 h-16 mb-4 opacity-20" />
                        <p>SELECT A FILE TO DECRYPT</p>
                    </div>
                )}
            </div>
        </div>
    );
}
