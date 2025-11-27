import React from 'react';
import { Database, Search, Lock, Unlock } from 'lucide-react';

export default function IntelView({ campaign }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h3 className="text-xl font-orbitron text-cyber-cyan flex items-center gap-2">
                    <Database className="w-5 h-5" /> INTEL DATABASE
                </h3>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="SEARCH DATABASE..."
                        className="bg-black/40 border border-gray-800 rounded pl-9 pr-4 py-1 text-sm text-white focus:border-cyber-cyan focus:outline-none font-rajdhani w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-500 font-orbitron text-sm">
                            <th className="p-4">STATUS</th>
                            <th className="p-4">ITEM / CLUE</th>
                            <th className="p-4">DESCRIPTION</th>
                            <th className="p-4">DETAILS</th>
                        </tr>
                    </thead>
                    <tbody className="font-rajdhani">
                        {campaign.clues.length > 0 ? (
                            campaign.clues.map(clue => (
                                <tr key={clue.id} className="border-b border-gray-800/50 hover:bg-cyber-cyan/5 transition-colors group">
                                    <td className="p-4">
                                        <span className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded w-fit ${clue.status === 'Decrypted'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                                                : 'bg-red-500/10 text-red-500 border border-red-500/30'
                                            }`}>
                                            {clue.status === 'Decrypted' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                            {clue.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-white group-hover:text-cyber-cyan transition-colors">
                                        {clue.item}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {clue.description}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-mono">
                                        {clue.details || '---'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-12 text-gray-500 italic">
                                    NO INTEL GATHERED
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
