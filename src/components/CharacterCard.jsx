import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trash2 } from 'lucide-react';

/**
 * Renders a single character card with basic stats and delete action.
 */
export default function CharacterCard({ character, onDelete }) {
    const handleDelete = (e) => {
        e.preventDefault();
        onDelete(character.id);
    };

    return (
        <Link
            to={`/characters/${character.id}`}
            className="group relative bg-black/40 border border-cyber-gray/30 hover:border-cyber-cyan transition-all p-6 overflow-hidden"
        >
            <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-cyber-dark border border-cyber-gray rounded-full">
                    <User className="w-6 h-6 text-cyber-cyan" />
                </div>
                <button
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-500 transition-colors z-10"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-xl font-orbitron text-white group-hover:text-cyber-cyan transition-colors mb-1">
                {character.name}
            </h3>
            <p className="text-sm text-cyber-magenta font-mono mb-4">
                {character.metatype} {character.archetype ? `// ${character.archetype}` : ''}
            </p>

            <div className="flex gap-2 text-xs text-gray-400 font-mono">
                <span className="bg-black/50 px-2 py-1 border border-gray-800">ESS: {character.attributes?.essence?.total}</span>
                <span className="bg-black/50 px-2 py-1 border border-gray-800">INIT: {character.initiative?.base}</span>
            </div>
        </Link>
    );
}
