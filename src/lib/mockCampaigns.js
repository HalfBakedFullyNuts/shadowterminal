export const mockCampaigns = [
    {
        id: 'campaign-001',
        name: 'Neon Rain',
        gmId: 'user-gm',
        description: 'A gritty noir investigation into the disappearance of a prominent corporate defector in the Seattle Metroplex.',
        nextSession: '2055-11-25T20:00:00',
        players: ['user-1', 'user-2', 'user-3'],
        characters: [
            { 
                id: 'char-1', 
                userId: 'user-1', 
                name: 'Ghost', 
                archetype: 'Infiltrator', 
                status: 'active',
                race: 'Elf',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost'
            },
            { 
                id: 'char-2', 
                userId: 'user-2', 
                name: 'Chrome', 
                archetype: 'Street Samurai', 
                status: 'active',
                race: 'Human',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chrome'
            },
            { 
                id: 'char-3', 
                userId: 'user-3', 
                name: 'Hex', 
                archetype: 'Mage', 
                status: 'active',
                race: 'Human',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hex'
            },
            { 
                id: 'char-4', 
                userId: 'user-1', 
                name: 'Spare', 
                archetype: 'Face', 
                status: 'passive',
                race: 'Human',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spare'
            }
        ],
        npcs: [
            { 
                id: 'npc-1', 
                name: 'Mr. Johnson', 
                type: 'Fixer', 
                isPublic: true, 
                description: 'A corporate liaison with ties to Ares Macrotechnology.',
                stats: {
                    body: 3,
                    agility: 2,
                    reaction: 3,
                    strength: 2,
                    charisma: 5,
                    intuition: 4,
                    logic: 4,
                    willpower: 4
                },
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johnson'
            },
            { 
                id: 'npc-2', 
                name: 'Red Samurai Captain', 
                type: 'Threat', 
                isPublic: false, 
                description: 'Leader of the extraction team.',
                stats: {
                    body: 6,
                    agility: 5,
                    reaction: 5,
                    strength: 5,
                    charisma: 3,
                    intuition: 4,
                    logic: 3,
                    willpower: 5
                }
            },
            { 
                id: 'npc-3', 
                name: 'Mama San', 
                type: 'Contact', 
                isPublic: true, 
                description: 'Runs the local noodle shop. Knows everything.',
                stats: {
                    body: 2,
                    agility: 2,
                    reaction: 2,
                    strength: 2,
                    charisma: 6,
                    intuition: 5,
                    logic: 3,
                    willpower: 3
                },
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MamaSan'
            }
        ],
        sessions: [
            { 
                id: 'session-1', 
                title: 'The Drop', 
                date: '2055-11-20', 
                karma: 5, 
                nuyen: 2000, 
                notes: 'Met with Johnson at the Stuffer Shack. Accepted the job to extract Dr. Kovic. Encountered gangers on the way out.',
                participants: ['Ghost', 'Chrome', 'Hex']
            },
            { 
                id: 'session-2', 
                title: 'Stakeout', 
                date: '2055-11-22', 
                karma: 2, 
                nuyen: 0, 
                notes: 'Surveilled the safehouse. Identified 4 guards and a magical ward. Ghost managed to loop the camera feed.',
                participants: ['Ghost', 'Chrome', 'Hex']
            }
        ],
        clues: [
            { 
                id: 'clue-1', 
                item: 'Encrypted Datachip', 
                description: 'Found on the body of the ganger leader.', 
                status: 'Decrypted',
                details: 'Contains a route map to the safehouse.'
            },
            { 
                id: 'clue-2', 
                item: 'Strange Amulet', 
                description: ' glowing faintly with astral energy.', 
                status: 'Unidentified',
                details: 'Needs magical analysis.'
            }
        ]
    },
    {
        id: 'campaign-002',
        name: 'Corporate Wars',
        gmId: 'user-gm-2',
        description: 'High-stakes corporate espionage in the boardrooms of Neo-Tokyo.',
        nextSession: 'TBD',
        players: ['user-1'],
        characters: [
            { 
                id: 'char-5', 
                userId: 'user-1', 
                name: 'Null', 
                archetype: 'Decker', 
                status: 'active',
                race: 'Human',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Null'
            }
        ],
        npcs: [],
        sessions: [],
        clues: []
    }
];
