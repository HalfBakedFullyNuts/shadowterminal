import React, { useState } from 'react';
import { User, Shield, Globe, Lock, Trash2, AlertTriangle } from 'lucide-react';

export default function CharacterSheetHeader({ character, setCharacter, onSave, isSaving, onDelete, isNew }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-cyber-cyan/30 pb-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan rounded-full">
                    <User className="w-8 h-8 text-cyber-cyan" />
                </div>
                <div>
                    <input
                        type="text"
                        value={character.name}
                        onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                        className="bg-transparent text-2xl md:text-3xl font-orbitron font-bold text-white border-b border-transparent hover:border-cyber-cyan focus:border-cyber-cyan focus:outline-none transition-all w-full md:w-auto"
                        placeholder="CHARACTER NAME"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <input
                            type="text"
                            value={character.metatype}
                            onChange={(e) => setCharacter({ ...character, metatype: e.target.value })}
                            className="bg-transparent text-cyber-cyan/70 text-sm font-mono border-b border-transparent hover:border-cyber-cyan/50 focus:border-cyber-cyan focus:outline-none w-24"
                            placeholder="METATYPE"
                        />
                        <span className="text-gray-600">|</span>
                        <input
                            type="text"
                            value={character.archetype}
                            onChange={(e) => setCharacter({ ...character, archetype: e.target.value })}
                            className="bg-transparent text-cyber-cyan/70 text-sm font-mono border-b border-transparent hover:border-cyber-cyan/50 focus:border-cyber-cyan focus:outline-none w-32"
                            placeholder="ARCHETYPE"
                        />
                        <span className="text-gray-600">|</span>
                        <div className="flex items-center gap-1" title="Total Karma">
                            <span className="text-xs text-gray-500">K:</span>
                            <input
                                type="number"
                                value={character.karma?.total || 0}
                                onChange={(e) => setCharacter({ ...character, karma: { ...character.karma, total: parseInt(e.target.value) || 0 } })}
                                className="bg-transparent text-cyber-magenta text-sm font-mono border-b border-transparent hover:border-cyber-magenta/50 focus:border-cyber-magenta focus:outline-none w-12"
                            />
                        </div>
                        <div className="flex items-center gap-1" title="Street Cred (Karma/10)">
                            <span className="text-xs text-gray-500">SC:</span>
                            <span className="text-cyber-yellow text-sm font-mono">{character.streetCred || 0}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Notoriety">
                            <span className="text-xs text-gray-500">NOT:</span>
                            <input
                                type="number"
                                value={character.notoriety || 0}
                                onChange={(e) => setCharacter({ ...character, notoriety: parseInt(e.target.value) || 0 })}
                                className="bg-transparent text-red-500 text-sm font-mono border-b border-transparent hover:border-red-500/50 focus:border-red-500 focus:outline-none w-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCharacter({ ...character, type: character.type === 'PC' ? 'NPC' : 'PC' })}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-bold border transition-all ${character.type === 'NPC'
                            ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta'
                            : 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                            }`}
                    >
                        <Shield className="w-3 h-3" />
                        {character.type || 'PC'}
                    </button>

                    <button
                        onClick={() => setCharacter({ ...character, isPublic: !character.isPublic })}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-bold border transition-all ${character.isPublic
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'bg-red-500/20 border-red-500 text-red-400'
                            }`}
                    >
                        {character.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {character.isPublic ? 'PUBLIC' : 'PRIVATE'}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all font-orbitron tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'SAVING...' : 'SAVE DATA'}
                    </button>

                    {!isNew && onDelete && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/20 transition-all"
                            title="Delete Character"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-gray-900 border-2 border-red-500 p-6 max-w-md w-full mx-4 rounded shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <h2 className="text-xl font-orbitron text-red-500">DELETE CHARACTER</h2>
                        </div>

                        <p className="text-gray-400 mb-4">
                            This action <span className="text-red-500 font-bold">cannot be undone</span>.
                            All character data including skills, gear, and spells will be permanently deleted.
                        </p>

                        <p className="text-gray-400 mb-4">
                            Type <span className="text-red-500 font-mono font-bold">{character.name || 'DELETE'}</span> to confirm:
                        </p>

                        <input
                            type="text"
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="Type character name to confirm"
                            className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white mb-4 focus:border-red-500 focus:outline-none font-mono"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    if (deleteInput === (character.name || 'DELETE')) {
                                        onDelete();
                                    }
                                }}
                                disabled={deleteInput !== (character.name || 'DELETE')}
                                className="flex-1 py-2 bg-red-500 text-white font-orbitron disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-all"
                            >
                                TERMINATE
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteInput('');
                                }}
                                className="flex-1 py-2 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
