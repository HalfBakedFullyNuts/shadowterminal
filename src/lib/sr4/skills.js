export const ATTRIBUTES = {
    BOD: { id: 'body', label: 'Body', abbr: 'BOD' },
    AGI: { id: 'agility', label: 'Agility', abbr: 'AGI' },
    REA: { id: 'reaction', label: 'Reaction', abbr: 'REA' },
    STR: { id: 'strength', label: 'Strength', abbr: 'STR' },
    CHA: { id: 'charisma', label: 'Charisma', abbr: 'CHA' },
    INT: { id: 'intuition', label: 'Intuition', abbr: 'INT' },
    LOG: { id: 'logic', label: 'Logic', abbr: 'LOG' },
    WIL: { id: 'willpower', label: 'Willpower', abbr: 'WIL' },
    EDG: { id: 'edge', label: 'Edge', abbr: 'EDG' },
    MAG: { id: 'magic', label: 'Magic', abbr: 'MAG' },
    RES: { id: 'resonance', label: 'Resonance', abbr: 'RES' }
};

export const SKILL_CATEGORIES = {
    COMBAT: 'Combat',
    PHYSICAL: 'Physical',
    SOCIAL: 'Social',
    MAGICAL: 'Magical',
    RESONANCE: 'Resonance',
    TECHNICAL: 'Technical',
    VEHICLE: 'Vehicle'
};

export const ACTIVE_SKILLS = [
    // Combat
    { id: 'archery', name: 'Archery', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'automatics', name: 'Automatics', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'blades', name: 'Blades', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'clubs', name: 'Clubs', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'dodge', name: 'Dodge', attribute: 'reaction', category: SKILL_CATEGORIES.COMBAT },
    { id: 'heavy_weapons', name: 'Heavy Weapons', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'longarms', name: 'Longarms', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'pistols', name: 'Pistols', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'throwing_weapons', name: 'Throwing Weapons', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },
    { id: 'unarmed_combat', name: 'Unarmed Combat', attribute: 'agility', category: SKILL_CATEGORIES.COMBAT },

    // Physical
    { id: 'climbing', name: 'Climbing', attribute: 'strength', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'disguise', name: 'Disguise', attribute: 'intuition', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'escape_artist', name: 'Escape Artist', attribute: 'agility', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'gymnastics', name: 'Gymnastics', attribute: 'agility', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'infiltration', name: 'Infiltration', attribute: 'agility', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'navigation', name: 'Navigation', attribute: 'intuition', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'palming', name: 'Palming', attribute: 'agility', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'perception', name: 'Perception', attribute: 'intuition', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'running', name: 'Running', attribute: 'strength', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'shadowing', name: 'Shadowing', attribute: 'intuition', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'survival', name: 'Survival', attribute: 'willpower', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'swimming', name: 'Swimming', attribute: 'strength', category: SKILL_CATEGORIES.PHYSICAL },
    { id: 'tracking', name: 'Tracking', attribute: 'intuition', category: SKILL_CATEGORIES.PHYSICAL },

    // Social
    { id: 'con', name: 'Con', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },
    { id: 'etiquette', name: 'Etiquette', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },
    { id: 'instruction', name: 'Instruction', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },
    { id: 'intimidation', name: 'Intimidation', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },
    { id: 'leadership', name: 'Leadership', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },
    { id: 'negotiation', name: 'Negotiation', attribute: 'charisma', category: SKILL_CATEGORIES.SOCIAL },

    // Magical
    { id: 'assensing', name: 'Assensing', attribute: 'intuition', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'astral_combat', name: 'Astral Combat', attribute: 'willpower', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'banishing', name: 'Banishing', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'binding', name: 'Binding', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'counterspelling', name: 'Counterspelling', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'ritual_spellcasting', name: 'Ritual Spellcasting', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'spellcasting', name: 'Spellcasting', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },
    { id: 'summoning', name: 'Summoning', attribute: 'magic', category: SKILL_CATEGORIES.MAGICAL },

    // Resonance
    { id: 'compiling', name: 'Compiling', attribute: 'resonance', category: SKILL_CATEGORIES.RESONANCE },
    { id: 'decompiling', name: 'Decompiling', attribute: 'resonance', category: SKILL_CATEGORIES.RESONANCE },
    { id: 'registering', name: 'Registering', attribute: 'resonance', category: SKILL_CATEGORIES.RESONANCE },

    // Technical
    { id: 'aeronautics_mechanic', name: 'Aeronautics Mechanic', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'animal_husbandry', name: 'Animal Husbandry', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'armorer', name: 'Armorer', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'artisan', name: 'Artisan', attribute: 'intuition', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'automotive_mechanic', name: 'Automotive Mechanic', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'biotechnology', name: 'Biotechnology', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'chemistry', name: 'Chemistry', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'computer', name: 'Computer', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'cybercombat', name: 'Cybercombat', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'cybertechnology', name: 'Cybertechnology', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'data_search', name: 'Data Search', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'demolitions', name: 'Demolitions', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'electronic_warfare', name: 'Electronic Warfare', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'first_aid', name: 'First Aid', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'forgery', name: 'Forgery', attribute: 'agility', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'hacking', name: 'Hacking', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'hardware', name: 'Hardware', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'industrial_mechanic', name: 'Industrial Mechanic', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'locksmith', name: 'Locksmith', attribute: 'agility', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'medicine', name: 'Medicine', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'nautical_mechanic', name: 'Nautical Mechanic', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },
    { id: 'software', name: 'Software', attribute: 'logic', category: SKILL_CATEGORIES.TECHNICAL },

    // Vehicle
    { id: 'gunnery', name: 'Gunnery', attribute: 'agility', category: SKILL_CATEGORIES.VEHICLE },
    { id: 'pilot_aerospace', name: 'Pilot Aerospace', attribute: 'reaction', category: SKILL_CATEGORIES.VEHICLE },
    { id: 'pilot_aircraft', name: 'Pilot Aircraft', attribute: 'reaction', category: SKILL_CATEGORIES.VEHICLE },
    { id: 'pilot_anthroform', name: 'Pilot Anthroform', attribute: 'reaction', category: SKILL_CATEGORIES.VEHICLE },
    { id: 'pilot_ground_craft', name: 'Pilot Ground Craft', attribute: 'reaction', category: SKILL_CATEGORIES.VEHICLE },
    { id: 'pilot_watercraft', name: 'Pilot Watercraft', attribute: 'reaction', category: SKILL_CATEGORIES.VEHICLE }
];
