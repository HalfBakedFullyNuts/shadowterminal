import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, Brain, Zap, Wifi, Database, Users, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCharacterData } from './useCharacterData';
import CharacterSheetHeader from './parts/Header';
import CoreTab from './tabs/CoreTab';
import SkillsTab from './tabs/SkillsTab';
import ModuleSection from './ModuleSection';

/**
 * Main Container for the Character Sheet.
 * Orchestrates data loading, tab switching, and sub-component rendering.
 * Adheres to strict code quality rules: <60 lines per function, defensive checks.
 */
export default function CharacterSheet() {
    const { characterId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { character, setCharacter, loading, saving, saveCharacter } = useCharacterData(characterId, currentUser);
    const [activeTab, setActiveTab] = useState('core');

    const handleSave = async () => {
        const newId = await saveCharacter();
        if (newId && characterId === 'new') {
            navigate(`/characters/${newId}`);
        }
    };

    if (loading) return <div className="p-8 text-cyber-cyan animate-pulse">INITIALIZING SIMULATION...</div>;
    if (!character) return <div className="p-8 text-red-500">ERROR: DATA CORRUPTED</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center min-h-screen p-6 relative">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none" />
            <div className="relative z-10">
                <CharacterSheetHeader
                    character={character}
                    setCharacter={setCharacter}
                    onSave={handleSave}
                    saving={saving}
                    onBack={() => navigate('/characters')}
                />

                <ModuleToggles character={character} setCharacter={setCharacter} />
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} character={character} />

                <div className="bg-black/20 border border-cyber-gray/20 p-6 min-h-[500px]">
                    <TabContent activeTab={activeTab} character={character} setCharacter={setCharacter} />
                </div>
            </div>
        </div>
    );
}

function ModuleToggles({ character, setCharacter }) {
    const toggleModule = (mod) => {
        setCharacter(p => ({ ...p, modules: { ...p.modules, [mod]: !p.modules[mod] } }));
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 px-2">
            {Object.keys(character.modules).map(mod => (
                <button
                    key={mod}
                    onClick={() => toggleModule(mod)}
                    className={`px-3 py-1 text-xs border transition-all uppercase ${character.modules[mod]
                        ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta'
                        : 'bg-black/20 border-gray-700 text-gray-500 hover:border-gray-500'
                        }`}
                >
                    {mod}
                </button>
            ))}
        </div>
    );
}

function TabNavigation({ activeTab, setActiveTab, character }) {
    const TABS = [
        { id: 'core', label: 'OVERVIEW', icon: Activity },
        { id: 'skills', label: 'SKILLS', icon: Brain },
        { id: 'gear', label: 'GEAR', icon: Shield },
        ...(character.modules.magic ? [{ id: 'magic', label: 'MAGIC', icon: Zap }] : []),
        ...(character.modules.matrix ? [{ id: 'matrix', label: 'MATRIX', icon: Wifi }] : []),
        ...(character.modules.augmentations ? [{ id: 'aug', label: 'AUGMENTATIONS', icon: Database }] : []),
        ...(character.modules.social ? [{ id: 'social', label: 'SOCIAL', icon: Users }] : []),
    ];

    return (
        <div className="flex gap-1 border-b border-cyber-gray/30 overflow-x-auto">
            {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-orbitron text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'text-cyber-cyan border-b-2 border-cyber-cyan bg-cyber-cyan/5'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

function TabContent({ activeTab, character, setCharacter }) {
    switch (activeTab) {
        case 'core': return <CoreTab character={character} setCharacter={setCharacter} />;
        case 'skills': return <SkillsTab character={character} setCharacter={setCharacter} />;
        case 'magic': return <ModuleSection
            title="SPELL GRIMOIRE"
            items={character.spells || []}
            fields={[
                { key: 'name', label: 'Spell Name', placeholder: 'Manabolt' },
                { key: 'type', label: 'Type', placeholder: 'Mana/Physical' },
                { key: 'range', label: 'Range', placeholder: 'LOS' },
                { key: 'duration', label: 'Duration', placeholder: 'Instant' },
                { key: 'drain', label: 'Drain', placeholder: 'F/2 + 3' }
            ]}
            onItemAdd={item => setCharacter(p => ({ ...p, spells: [...(p.spells || []), item] }))}
            onItemRemove={id => setCharacter(p => ({ ...p, spells: p.spells.filter(i => i.id !== id) }))}
        />;
        case 'aug': return <ModuleSection
            title="CYBERWARE & BIOWARE"
            items={character.cyberware || []}
            fields={[
                { key: 'name', label: 'Augmentation', placeholder: 'Wired Reflexes' },
                { key: 'rating', label: 'Rating', placeholder: '1' },
                { key: 'essence', label: 'Essence Cost', placeholder: '2.0' },
                { key: 'notes', label: 'Notes', placeholder: '+1 REA, +1 IP' }
            ]}
            onItemAdd={item => setCharacter(p => ({ ...p, cyberware: [...(p.cyberware || []), item] }))}
            onItemRemove={id => setCharacter(p => ({ ...p, cyberware: p.cyberware.filter(i => i.id !== id) }))}
        />;
        case 'gear': return <ModuleSection
            title="EQUIPMENT"
            items={character.gear || []}
            fields={[
                { key: 'name', label: 'Item', placeholder: 'Ares Predator IV' },
                { key: 'rating', label: 'Rating/Damage', placeholder: '5P' },
                { key: 'qty', label: 'Qty', placeholder: '1' },
                { key: 'notes', label: 'Notes', placeholder: 'Smartlink' }
            ]}
            onItemAdd={item => setCharacter(p => ({ ...p, gear: [...(p.gear || []), item] }))}
            onItemRemove={id => setCharacter(p => ({ ...p, gear: p.gear.filter(i => i.id !== id) }))}
        />;
        default: return <div className="text-center py-20 text-gray-500 font-orbitron">MODULE UNDER CONSTRUCTION</div>;
    }
}
