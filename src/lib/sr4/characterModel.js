import { ACTIVE_SKILLS } from './skills';





export const createInitialCharacter = (userId) => {
    return {
        userId,
        name: 'New Runner',
        metatype: 'Human',
        archetype: '',
        notes: '',

        // Modules (toggles for UI sections)
        modules: {
            magic: false,
            resonance: false,
            matrix: false,
            rigger: false,
            augmentations: false,
            social: true
        },

        // Attributes
        attributes: {
            body: { base: 3, mod: 0, total: 3 },
            agility: { base: 3, mod: 0, total: 3 },
            reaction: { base: 3, mod: 0, total: 3 },
            strength: { base: 3, mod: 0, total: 3 },
            charisma: { base: 3, mod: 0, total: 3 },
            intuition: { base: 3, mod: 0, total: 3 },
            logic: { base: 3, mod: 0, total: 3 },
            willpower: { base: 3, mod: 0, total: 3 },
            edge: { base: 1, mod: 0, total: 1 },
            magic: { base: 0, mod: 0, total: 0 },
            resonance: { base: 0, mod: 0, total: 0 },
            essence: { base: 6, mod: 0, total: 6 }
        },

        // Derived Stats (calculated on save/load usually, but stored for ease)
        initiative: { base: 6, passes: 1 }, // REA(3) + INT(3) = 6
        matrixInitiative: { base: 6, passes: 1 },
        astralInitiative: { base: 6, passes: 3 },

        // Condition Monitors
        condition: {
            physical: { max: 10, current: 0 },
            stun: { max: 10, current: 0 },
            matrix: { max: 10, current: 0 }
        },

        // Skills
        skills: {
            active: {}, // { skillId: { rating: 0, spec: '' } }
            knowledge: [] // [{ name: '', attribute: '', rating: 0 }]
        },

        // Gear & Assets
        nuyen: 0,
        karma: { total: 0, current: 0 },
        streetCred: 0,
        notoriety: 0,

        // Module Data
        spells: [],
        spirits: [],
        powers: [], // Adept powers
        complexForms: [],
        sprites: [],
        programs: [],
        gear: [],
        cyberware: [],
        bioware: [],
        contacts: []
    };
};

export const calculateDerivedStats = (char) => {
    const attrs = char.attributes;

    // Initiative: REA + INT
    const initBase = (attrs.reaction?.total || 0) + (attrs.intuition?.total || 0);

    // Matrix Init: REA + INT (Cold) or INT + Data Processing (Hot)
    const matrixInitBase = (attrs.reaction?.total || 0) + (attrs.intuition?.total || 0);

    // Astral Init: INT * 2
    const astralInitBase = (attrs.intuition?.total || 0) * 2;

    // Condition Monitors
    // Physical: 8 + (BOD / 2) rounded up
    const physMax = 8 + Math.ceil((attrs.body?.total || 0) / 2);
    // Stun: 8 + (WIL / 2) rounded up
    const stunMax = 8 + Math.ceil((attrs.willpower?.total || 0) / 2);
    // Matrix: 8 + (LOG / 2) rounded up
    const matrixMax = 8 + Math.ceil((attrs.logic?.total || 0) / 2);

    // Wound Modifiers: -1 for every 3 boxes of damage (Physical + Stun)
    // Note: In SR4, modifiers are usually separate for Phys/Stun, but they stack for tests.
    // We'll calculate the total penalty.
    const physWounds = Math.floor((char.condition.physical.current || 0) / 3);
    const stunWounds = Math.floor((char.condition.stun.current || 0) / 3);
    const totalWoundMod = -(physWounds + stunWounds);

    // Compound Tests
    const composure = (attrs.willpower?.total || 0) + (attrs.charisma?.total || 0);
    const memory = (attrs.logic?.total || 0) + (attrs.willpower?.total || 0);
    const judgeIntentions = (attrs.intuition?.total || 0) + (attrs.charisma?.total || 0);
    const liftCarry = (attrs.body?.total || 0) + (attrs.strength?.total || 0);
    const surprise = (attrs.reaction?.total || 0) + (attrs.intuition?.total || 0);

    // Street Cred = Total Karma / 10
    const streetCred = Math.floor((char.karma?.total || 0) / 10);

    return {
        ...char,
        streetCred, // Auto-calculated
        initiative: { ...char.initiative, base: initBase },
        matrixInitiative: { ...char.matrixInitiative, base: matrixInitBase },
        astralInitiative: { ...char.astralInitiative, base: astralInitBase },
        condition: {
            physical: { ...char.condition.physical, max: physMax },
            stun: { ...char.condition.stun, max: stunMax },
            matrix: { ...char.condition.matrix, max: matrixMax }
        },
        derived: {
            woundMod: totalWoundMod,
            composure,
            memory,
            judgeIntentions,
            liftCarry,
            surprise
        }
    };
};
