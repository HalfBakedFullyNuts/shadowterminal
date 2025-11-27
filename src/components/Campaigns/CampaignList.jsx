import React from 'react';
import { Link } from 'react-router-dom';
import { mockCampaigns } from '../../lib/mockCampaigns';
import { Users, Calendar, ChevronRight, Shield } from 'lucide-react';

export default function CampaignList() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-orbitron text-cyber-yellow">MY CAMPAIGNS</h2>
                <div className="text-sm text-gray-500 font-rajdhani">
                    {mockCampaigns.length} ACTIVE OPERATIONS
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {mockCampaigns.map(campaign => (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className="group block"
                    >
                        <div className="cyber-border bg-cyber-dark/50 p-6 hover:bg-cyber-cyan/5 transition-all duration-300 group-hover:box-glow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="text-2xl font-orbitron text-white group-hover:text-cyber-cyan transition-colors">
                                            {campaign.name}
                                        </h3>
                                        <p className="text-gray-400 mt-2 max-w-2xl">
                                            {campaign.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-6 text-sm text-cyber-cyan/80 font-rajdhani">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{campaign.characters.length} OPERATIVES</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>NEXT SESSION: {campaign.nextSession === 'TBD' ? 'PENDING' : new Date(campaign.nextSession).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className="px-4 py-2 border border-cyber-cyan/30 text-cyber-cyan text-sm font-bold group-hover:bg-cyber-cyan group-hover:text-black transition-all flex items-center gap-2">
                                        ACCESS FILES <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
