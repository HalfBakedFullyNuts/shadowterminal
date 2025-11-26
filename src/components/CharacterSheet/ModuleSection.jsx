import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ModuleItemForm from './parts/ModuleItemForm';
import ModuleItemList from './parts/ModuleItemList';

/**
 * Generic wrapper for optional sections (like Spells or Cyberware).
 * Manages the "Add Mode" state and delegates rendering to sub-components.
 */
export default function ModuleSection({ title, items, onItemAdd, onItemRemove, fields }) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (newItem) => {
        onItemAdd(newItem);
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-cyber-cyan/30 pb-2">
                <h3 className="text-xl font-orbitron text-cyber-yellow">{title}</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1 text-xs bg-cyber-cyan/10 text-cyber-cyan px-2 py-1 hover:bg-cyber-cyan/20 transition-colors border border-cyber-cyan/30"
                >
                    <Plus className="w-3 h-3" /> ADD ENTRY
                </button>
            </div>

            {isAdding && (
                <ModuleItemForm
                    fields={fields}
                    onSave={handleAdd}
                    onCancel={() => setIsAdding(false)}
                />
            )}

            <ModuleItemList
                items={items}
                fields={fields}
                onItemRemove={onItemRemove}
            />
        </div>
    );
}
