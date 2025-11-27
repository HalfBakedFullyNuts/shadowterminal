import React, { useState } from 'react';
import { Users, Eye, EyeOff, Shield } from 'lucide-react';

export default function SquadView({ campaign }) {
    const [showPassive, setShowPassive] = useState(false);

    const activeCharacters = campaign.characters.filter(c => c.status === 'active');
    const passiveCharacters = campaign.characters.filter(c => c.status === 'passive');

    const CharacterCard = ({ char }) => (
        <div className="cyber-border bg-cyber-dark/30 p-4 flex items-center gap-4 group hover:bg-cyber-cyan/5 transition-colors">
            <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden border-2 border-cyber-cyan/50 group-hover:border-cyber-cyan transition-colors">
                <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-orbitron text-white">{char.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${char.status === 'active'
                            ? 'border-green-500 text-green-500 bg-green-500/10'
                            : 'border-gray-500 text-gray-500 bg-gray-500/10'
                        }`}>
                        {char.status.toUpperCase()}
                    </span>
                </div>
                <div className="text-sm text-cyber-cyan font-rajdhani">{char.archetype}</div>
                <div className="text-xs text-gray-500 mt-1">{char.race}</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Active Squad */}
            <div className="space-y-4">
                <h3 className="text-xl font-orbitron text-cyber-cyan flex items-center gap-2 border-b border-gray-800 pb-2">
                    <Shield className="w-5 h-5" /> ACTIVE SQUAD
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCharacters.map(char => (
                        <CharacterCard key={char.id} char={char} />
                    ))}
                </div>
            </div>

            {/* Passive / Reserves */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h3 className="text-xl font-orbitron text-gray-500 flex items-center gap-2">
                        <Users className="w-5 h-5" /> RESERVES / INACTIVE
                    </h3>
                    <button
                        onClick={() => setShowPassive(!showPassive)}
                        className="flex items-center gap-2 text-xs text-cyber-cyan hover:text-white transition-colors"
                    >
                        {showPassive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPassive ? 'HIDE RESERVES' : 'VIEW RESERVES'}
                    </button>
                </div>

                {showPassive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {passiveCharacters.length > 0 ? (
                            passiveCharacters.map(char => (
                                <CharacterCard key={char.id} char={char} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-gray-600 italic">
                                NO INACTIVE PERSONNEL FOUND
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
