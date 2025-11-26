import React from 'react';
import AttributeRow from '../AttributeRow';
import ConditionMonitor from '../parts/ConditionMonitor';
import { ATTRIBUTES } from '../../../lib/sr4/skills';

/**
 * Renders the Core Data tab (Attributes, Condition Monitors).
 */
export default function CoreTab({ character, setCharacter }) {
    const updateAttribute = (attrKey, newVal) => {
        const cappedVal = Math.min(Math.max(newVal, 1), 9); // Min 1, Max 9
        setCharacter(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [attrKey]: { ...prev.attributes[attrKey], base: cappedVal, total: cappedVal + prev.attributes[attrKey].mod }
            }
        }));
    };

    const updateCondition = (type, val) => {
        setCharacter(p => ({
            ...p,
            condition: {
                ...p.condition,
                [type]: { ...p.condition[type], current: val }
            }
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-orbitron text-cyber-yellow border-b border-cyber-yellow/20 pb-2">ATTRIBUTES</h3>
                <div className="space-y-2">
                    {Object.entries(ATTRIBUTES).map(([key, def]) => (
                        <AttributeRow
                            key={key}
                            label={`${def.label} (${def.abbr})`}
                            value={character.attributes[def.id]?.base || 0}
                            onChange={(val) => updateAttribute(def.id, val)}
                            total={character.attributes[def.id]?.total}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-orbitron text-cyber-yellow border-b border-cyber-yellow/20 pb-2">CONDITION</h3>
                <ConditionMonitor
                    label="PHYSICAL TRACK"
                    color="red"
                    current={character.condition.physical.current}
                    max={character.condition.physical.max}
                    onChange={(val) => updateCondition('physical', val)}
                />
                <ConditionMonitor
                    label="STUN TRACK"
                    color="blue"
                    current={character.condition.stun.current}
                    max={character.condition.stun.max}
                    onChange={(val) => updateCondition('stun', val)}
                />
                <ConditionMonitor
                    label="MATRIX TRACK"
                    color="green"
                    current={character.condition.matrix?.current || 0}
                    max={character.condition.matrix?.max || 10}
                    onChange={(val) => updateCondition('matrix', val)}
                />
                <DerivedStats character={character} />
            </div>
        </div>
    );
}

function DerivedStats({ character }) {
    const d = character.derived || {};

    return (
        <div className="mt-8 space-y-4">
            <div className="p-4 border border-cyber-cyan/20 bg-cyber-cyan/5">
                <h4 className="text-cyber-cyan font-orbitron mb-2 border-b border-cyber-cyan/20 pb-1">COMBAT STATS</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <StatRow label="INITIATIVE" value={`${character.initiative.base} (${character.initiative.passes} IP)`} />
                    <StatRow label="SURPRISE" value={d.surprise} />
                    <StatRow label="WOUND MOD" value={d.woundMod} color={d.woundMod < 0 ? 'text-red-400' : 'text-white'} />
                    <StatRow label="ESSENCE" value={character.attributes.essence.total} />
                </div>
            </div>

            <div className="p-4 border border-cyber-magenta/20 bg-cyber-magenta/5">
                <h4 className="text-cyber-magenta font-orbitron mb-2 border-b border-cyber-magenta/20 pb-1">COMPOUND TESTS</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <StatRow label="COMPOSURE" value={d.composure} sub="(WIL + CHA)" />
                    <StatRow label="MEMORY" value={d.memory} sub="(LOG + WIL)" />
                    <StatRow label="JUDGE INTENT" value={d.judgeIntentions} sub="(INT + CHA)" />
                    <StatRow label="LIFT/CARRY" value={d.liftCarry} sub="(BOD + STR)" />
                </div>
            </div>
        </div>
    );
}

function StatRow({ label, value, sub, color = 'text-white' }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-gray-400">{label}</span>
                {sub && <span className="text-[10px] text-gray-500">{sub}</span>}
            </div>
            <span className={`${color} font-bold font-mono text-lg`}>{value}</span>
        </div>
    );
}
