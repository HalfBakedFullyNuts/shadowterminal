import { useParams } from 'react-router-dom';

/**
 * Renders the Active Skills grid with grouping and filtering options.
 */
export default function SkillsTab({ character, setCharacter }) {
    const { characterId } = useParams();
    const [viewMode, setViewMode] = useState('cat'); // 'alpha', 'attr', 'cat'
    const [showHidden, setShowHidden] = useState(characterId === 'new');

    const updateSkill = (skillId, rating) => {
        setCharacter(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                active: {
                    ...prev.skills.active,
                    [skillId]: { rating }
                }
            }
        }));
    };

    const filteredSkills = useMemo(() => {
        return ACTIVE_SKILLS.filter(skill => {
            const rating = character.skills.active[skill.id]?.rating || 0;
            return showHidden || rating > 0;
        });
    }, [character.skills.active, showHidden]);

    const groupedSkills = useMemo(() => {
        if (viewMode === 'alpha') return { 'All Skills': filteredSkills };

        return filteredSkills.reduce((acc, skill) => {
            const key = viewMode === 'attr' ? skill.attribute.toUpperCase() : skill.category;
            if (!acc[key]) acc[key] = [];
            acc[key].push(skill);
            return acc;
        }, {});
    }, [filteredSkills, viewMode]);

    return (
        <div className="space-y-6">
            <SkillControls
                viewMode={viewMode}
                setViewMode={setViewMode}
                showHidden={showHidden}
                setShowHidden={setShowHidden}
            />

            <div className="space-y-8">
                {Object.entries(groupedSkills).map(([group, skills]) => (
                    <div key={group} className="animate-in fade-in slide-in-from-bottom-2">
                        <h4 className="text-cyber-cyan font-orbitron border-b border-cyber-cyan/20 mb-4 pb-1 text-sm tracking-widest">
                            {group}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skills.map(skill => (
                                <AttributeRow
                                    key={skill.id}
                                    label={skill.name}
                                    value={character.skills.active[skill.id]?.rating || 0}
                                    onChange={(val) => updateSkill(skill.id, val)}
                                    max={12}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {filteredSkills.length === 0 && (
                    <div className="text-center py-10 text-gray-500 italic">
                        No visible skills. Enable "Show Hidden" to see all.
                    </div>
                )}
            </div>
        </div>
    );
}

function SkillControls({ viewMode, setViewMode, showHidden, setShowHidden }) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-4 bg-black/30 p-3 border border-cyber-gray/30 rounded-sm">
            <div className="flex gap-2">
                <ControlButton
                    active={viewMode === 'cat'}
                    onClick={() => setViewMode('cat')}
                    icon={Layers}
                    label="CATEGORY"
                />
                <ControlButton
                    active={viewMode === 'attr'}
                    onClick={() => setViewMode('attr')}
                    icon={Grid}
                    label="ATTRIBUTE"
                />
                <ControlButton
                    active={viewMode === 'alpha'}
                    onClick={() => setViewMode('alpha')}
                    icon={List}
                    label="A-Z"
                />
            </div>

            <button
                onClick={() => setShowHidden(!showHidden)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-all ${showHidden
                    ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta'
                    : 'bg-black/20 border-gray-600 text-gray-400 hover:text-white'
                    }`}
            >
                {showHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {showHidden ? 'SHOWING ALL' : 'HIDING UNTRAINED'}
            </button>
        </div>
    );
}

function ControlButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-all ${active
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                : 'bg-black/20 border-gray-600 text-gray-400 hover:text-white'
                }`}
        >
            <Icon className="w-3 h-3" />
            {label}
        </button>
    );
}
