import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Displays a list of items in a module section.
 * Handles deletion of items.
 */
export default function ModuleItemList({ items, fields, onItemRemove }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600 italic text-sm">
                No data recorded in this module.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map(item => (
                <div key={item.id} className="p-3 bg-black/20 border border-cyber-gray/20 hover:border-cyber-cyan/30 transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            {fields.map(field => (
                                <div key={field.key}>
                                    <span className="text-xs text-gray-500 block md:hidden">{field.label}</span>
                                    <span className="text-sm text-gray-300">{item[field.key]}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => onItemRemove(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all ml-4"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
