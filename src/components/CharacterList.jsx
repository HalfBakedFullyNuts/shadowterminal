import React, { useState } from 'react';
import { Plus, Trash2, Shield, Globe, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCharacterList } from './useCharacterList';
import CharacterCard from './CharacterCard';

export default function CharacterList() {
    const { currentUser } = useAuth();
    const { characters, loading, createCharacter, deleteCharacter } = useCharacterList(currentUser);
    const navigate = useNavigate();
    const [isGM, setIsGM] = useState(false);

    const handleCreate = async () => {
        const newId = await createCharacter();
        if (newId) navigate(`/characters/${newId}`);
    };

    // Filtering Logic
    const visibleCharacters = characters.filter(char => {
        if (isGM) return true; // GM sees all
        if (char.userId === currentUser.uid) return true; // I see my own
        if (char.isPublic) return true; // I see public characters (NPCs or PCs)
        return false; // Hidden otherwise
    });

    const myCharacters = visibleCharacters.filter(c => c.userId === currentUser.uid);
    const otherCharacters = visibleCharacters.filter(c => c.userId !== currentUser.uid);

    if (loading) return <div className="text-cyber-cyan animate-pulse">ACCESSING DATABASE...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center border-b border-cyber-cyan/30 pb-4">
                <div>
                    <h2 className="text-3xl font-orbitron text-cyber-cyan text-glow">PERSONNEL DATABASE</h2>
                    <p className="text-gray-400 text-sm">MANAGE ASSETS AND DOSSIERS</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsGM(!isGM)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-all ${isGM
                                ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow'
                                : 'bg-black/20 border-gray-600 text-gray-500'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        {isGM ? 'GM MODE: ACTIVE' : 'GM MODE: OFF'}
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all font-orbitron"
                    >
                        <Plus className="w-4 h-4" />
                        NEW ASSET
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-cyber-cyan" /> MY ASSETS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCharacters.map(char => (
                            <CharacterCard
                                key={char.id}
                                character={char}
                                onDelete={() => deleteCharacter(char.id)}
                                isOwner={true}
                            />
                        ))}
                        {myCharacters.length === 0 && (
                            <div className="col-span-full text-gray-500 italic p-8 border border-dashed border-gray-700 rounded text-center">
                                No assets found. Initialize new dossier.
                            </div>
                        )}
                    </div>
                </section>

                {(otherCharacters.length > 0 || isGM) && (
                    <section>
                        <h3 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-cyber-magenta" /> PUBLIC / NETWORK ASSETS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherCharacters.map(char => (
                                <CharacterCard
                                    key={char.id}
                                    character={char}
                                    onDelete={() => isGM && deleteCharacter(char.id)} // Only GM can delete others
                                    isOwner={false}
                                />
                            ))}
                            {otherCharacters.length === 0 && (
                                <div className="col-span-full text-gray-500 italic">
                                    No public assets visible.
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
