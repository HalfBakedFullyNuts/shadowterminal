import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

/**
 * Form for adding a new item to a module section.
 * Handles input state and submission.
 */
export default function ModuleItemForm({ fields, onSave, onCancel }) {
    const [newItem, setNewItem] = useState({});

    const handleSave = () => {
        onSave({ ...newItem, id: Date.now().toString() });
        setNewItem({});
    };

    return (
        <div className="p-4 bg-cyber-cyan/5 border border-cyber-cyan/30 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.key} className="space-y-1">
                        <label className="text-xs text-cyber-cyan/70 uppercase">{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            value={newItem[field.key] || ''}
                            onChange={e => setNewItem({ ...newItem, [field.key]: e.target.value })}
                            className="w-full bg-black/50 border border-cyber-gray focus:border-cyber-cyan text-white px-2 py-1 outline-none text-sm"
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="p-1 hover:text-red-400"><X className="w-4 h-4" /></button>
                <button onClick={handleSave} className="p-1 hover:text-cyber-cyan"><Save className="w-4 h-4" /></button>
            </div>
        </div>
    );
}
