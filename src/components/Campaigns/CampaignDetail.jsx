import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCampaigns } from '../../lib/mockCampaigns';
import { Users, FileText, Database, Shield, ArrowLeft, Brain } from 'lucide-react';
import SquadView from './SquadView';
import MissionLog from './MissionLog';
import IntelView from './IntelView';
import NPCProfile from './NPCProfile';

export default function CampaignDetail() {
    const { campaignId } = useParams();
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    const [activeTab, setActiveTab] = useState('squad');

    if (!campaign) {
        return <div className="text-red-500">CAMPAIGN NOT FOUND</div>;
    }

    const tabs = [
        { id: 'squad', label: 'SQUAD', icon: Users },
        { id: 'missions', label: 'MISSION LOG', icon: FileText },
        { id: 'intel', label: 'INTEL', icon: Database },
        { id: 'npcs', label: 'NPC DATABASE', icon: Brain },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-800 pb-6">
                <Link to="/campaigns" className="text-cyber-cyan hover:text-white flex items-center gap-2 text-sm font-bold w-fit">
                    <ArrowLeft className="w-4 h-4" /> BACK TO CAMPAIGNS
                </Link>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-orbitron text-white text-glow">{campaign.name}</h1>
                        <p className="text-gray-400 mt-2 font-rajdhani">{campaign.description}</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-cyber-cyan tracking-widest mb-1">CAMPAIGN ID</div>
                        <div className="font-mono text-gray-500">{campaign.id}</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-orbitron text-sm tracking-wider transition-all clip-path-slant ${isActive
                                    ? 'bg-cyber-cyan text-black font-bold'
                                    : 'bg-cyber-dark/50 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 border border-gray-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'squad' && <SquadView campaign={campaign} />}
                {activeTab === 'missions' && <MissionLog campaign={campaign} />}
                {activeTab === 'intel' && <IntelView campaign={campaign} />}
                {activeTab === 'npcs' && <NPCProfile campaign={campaign} />}
            </div>
        </div>
    );
}
