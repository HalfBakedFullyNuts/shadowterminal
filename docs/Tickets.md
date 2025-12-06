# Shadowterminal Feature Tickets

## Ticket Statuses
- `[OPEN]` - Not started
- `[IN PROGRESS]` - Currently being worked on
- `[DONE]` - Completed
- `[BLOCKED]` - Waiting on external dependency

---

## ST-001: Implement System Settings Page
**Status:** `[OPEN]`
**Priority:** Medium
**Component:** Settings

### Description
The Settings page currently shows "SYSTEM SETTINGS LOCKED" placeholder text. Implement a functional settings page.

### Acceptance Criteria
- [ ] User preferences section (theme toggle if applicable)
- [ ] Notification preferences
- [ ] Google Drive connection status and disconnect option
- [ ] Account info display (email, login method)
- [ ] Danger zone (delete account option with confirmation)

### Technical Notes
- Location: `src/App.jsx:55` (currently placeholder div)
- Create new component: `src/components/Settings.jsx`

---

## ST-002: Implement PANIC Button Functionality
**Status:** `[OPEN]`
**Priority:** Low
**Component:** Dashboard

### Description
The PANIC button on the Dashboard is disabled (`cursor-not-allowed`, `opacity-50`). Implement thematic emergency functionality.

### Acceptance Criteria
- [ ] Button becomes clickable
- [ ] On click, shows modal with "emergency" options:
  - Quick session cancel notification
  - "I'm running late" broadcast to session participants
  - Emergency contact display
- [ ] Visual feedback (red glow, animation)

### Technical Notes
- Location: `src/components/Dashboard.jsx:208-211`
- Consider: What makes sense thematically for a Shadowrun app?

---

## ST-003: Implement Matrix Tab in Character Sheet
**Status:** `[OPEN]`
**Priority:** Medium
**Component:** CharacterSheet

### Description
The Matrix tab shows "MODULE UNDER CONSTRUCTION". Implement matrix/hacking equipment management.

### Acceptance Criteria
- [ ] Display cyberdeck information
- [ ] List programs (attack, sleaze, firewall, data processing)
- [ ] Matrix attributes (Attack, Sleaze, Data Processing, Firewall)
- [ ] Add/edit/remove programs
- [ ] Matrix condition monitor

### Technical Notes
- Location: `src/components/CharacterSheet/CharacterSheet.jsx:112-155`
- Follow existing pattern from GearTab/MagicTab
- Firestore path: `characters/{id}/matrix`

---

## ST-004: Implement Social Tab in Character Sheet
**Status:** `[OPEN]`
**Priority:** Low
**Component:** CharacterSheet

### Description
The Social tab shows "MODULE UNDER CONSTRUCTION". Implement contacts and social network management.

### Acceptance Criteria
- [ ] Contacts list with loyalty/connection ratings
- [ ] Add/edit/remove contacts
- [ ] Contact notes and specializations
- [ ] Lifestyle tracking
- [ ] SIN (System Identification Number) management

### Technical Notes
- Location: `src/components/CharacterSheet/CharacterSheet.jsx:112-155`
- Firestore path: `characters/{id}/contacts`

---

## ST-005: Implement Invite Agent Functionality
**Status:** `[OPEN]`
**Priority:** High
**Component:** Campaign

### Description
The "+ INVITE AGENT" button in CampaignDetails has no onClick handler. Implement player invitation system.

### Acceptance Criteria
- [ ] Click opens invite modal
- [ ] Generate shareable invite link/code
- [ ] Email invite option (optional)
- [ ] Show pending invites
- [ ] Accept/decline invite flow for recipients
- [ ] GM can revoke pending invites

### Technical Notes
- Location: `src/components/CampaignDetails.jsx:278-280`
- Requires new Firestore collection: `campaigns/{id}/invites`
- Consider: invite codes vs direct user lookup

---

## ST-006: Wire Up Search in IntelView
**Status:** `[OPEN]`
**Priority:** Medium
**Component:** Campaigns

### Description
The search input in IntelView exists but is not connected to filtering logic.

### Acceptance Criteria
- [ ] Search filters clues by name and description
- [ ] Real-time filtering as user types
- [ ] Clear search button
- [ ] "No results" state

### Technical Notes
- Location: `src/components/Campaigns/IntelView.jsx:13-17`
- Add useState for search term, filter clues array

---

## ST-007: Wire Up Search in DriveView
**Status:** `[OPEN]`
**Priority:** Medium
**Component:** Drive

### Description
The search input in DriveView/DriveBrowser exists but is not connected to Google Drive search API.

### Acceptance Criteria
- [ ] Search queries Google Drive API
- [ ] Debounce search input (300ms)
- [ ] Show loading state during search
- [ ] Clear search returns to folder view

### Technical Notes
- Location: `src/components/Drive/DriveBrowser.jsx`
- Use Google Drive API `files.list` with `q` parameter

---

## ST-008: Add Missing Routes for NPC/Clue Creation
**Status:** `[OPEN]`
**Priority:** High
**Component:** Routing

### Description
Links to `/campaigns/{id}/npcs/new` and `/campaigns/{id}/clues/new` exist but routes are not defined in App.jsx.

### Acceptance Criteria
- [ ] Add routes for NPC creation page
- [ ] Add routes for Clue creation page
- [ ] Routes should embed NPCManager/ClueManager with create mode

### Technical Notes
- Location: `src/App.jsx` routes section
- Links at: `src/components/CampaignDetails.jsx:197-203, 217-223`

---

## ST-009: Enable Firestore Index for Character Sorting
**Status:** `[OPEN]`
**Priority:** Low
**Component:** Dashboard

### Description
The `orderBy('updatedAt', 'desc')` is commented out in RunnerStatus because Firestore index doesn't exist.

### Acceptance Criteria
- [ ] Create composite index in Firestore
- [ ] Uncomment orderBy in code
- [ ] Characters sorted by most recently updated

### Technical Notes
- Location: `src/components/Dashboard/RunnerStatus.jsx:22`
- Requires Firebase Console: Firestore > Indexes

---

## ST-010: Implement Character Delete Functionality
**Status:** `[OPEN]`
**Priority:** Medium
**Component:** CharacterSheet

### Description
No UI exists to delete a character. Users cannot remove unwanted characters.

### Acceptance Criteria
- [ ] Delete button in character sheet (danger zone)
- [ ] Confirmation modal with character name verification
- [ ] Soft delete option (archive) vs hard delete
- [ ] Cannot delete if character is in active campaign

### Technical Notes
- Add to CharacterSheet header or settings area
- Consider: cascade delete subcollections (skills, gear, etc.)

---

## Completed Tickets

### ST-000: Implement Cyberpunk 2077 Glitch Button Effect
**Status:** `[DONE]`

Feature Request: Implement Cyberpunk 2077 Glitch Button Effect

Goal

Implement a pure CSS button effect that mimics the futuristic, glitching aesthetic of the Cyberpunk 2077 UI. The effect should appear when the user hovers over the button.

Acceptance Criteria

The button must use the required HTML structure (.cybr-btn, __glitch, __tag).

The custom font "Cyber" must be loaded and applied to the button text.

The button should display the unique clipped-corner and stacked-border design.

On hover, the hidden glitch element must appear and run the glitch CSS animation.

The effect must be fully responsive and contained within the button's boundaries.

Implementation Steps

Step 1: Add Custom Font (CSS/Stylesheet)

Add the following @font-face declaration to your global stylesheet to load the necessary font.

@font-face {
    font-family: Cyber;
    src: url("[https://assets.codepen.io/605876/Blender-Pro-Bold.otf](https://assets.codepen.io/605876/Blender-Pro-Bold.otf)");
    font-display: swap;
}


Step 2: HTML Structure (Button Markup)

Use the following nesting structure for every button where the glitch effect is needed. The <span> elements contain the duplicate text and tag, hidden from screen readers via aria-hidden.

<button class="cybr-btn">
    BUTTON TEXT<span aria-hidden>_</span>
    <span aria-hidden class="cybr-btn__glitch">BUTTON TEXT_</span>
    <span aria-hidden class="cybr-btn__tag">R25</span>
</button>


Step 3: Complete CSS Implementation

Apply the following styles, which utilize CSS variables, pseudo-elements, clip-path, and keyframes to create the layered and animated effect.

/* --- CSS VARIABLES & BASE STYLES --- */
.cybr-btn {
    /* Color Variables (Default: Red/Orange with Cyan Shadow/Glitch) */
    --primary-hue: 0; /* 0 = Red/Orange */
    --shadow-primary-hue: 180; /* 180 = Cyan/Blue */
    --shadow-secondary-hue: 60; /* 60 = Yellow/Gold */
    
    --primary-lightness: 50;
    --primary: hsl(var(--primary-hue), 85%, calc(var(--primary-lightness, 50) * 1%));
    --shadow-primary: hsl(var(--shadow-primary-hue), 90%, 50%);
    --shadow-secondary: hsl(var(--shadow-secondary-hue), 90%, 60%);
    --color: hsl(0, 0%, 100%);
    
    /* Size & Shape Variables */
    --font-size: 26px;
    --border: 4px;
    --label-size: 9px;
    --shimmy-distance: 5; /* For glitch translation */
    --clip: polygon(0 0, 100% 0, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 70%); 
    
    /* Clipping variables for the animation keyframes */
    --clip-one: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
    --clip-two: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 70%);
    --clip-three: polygon(0 54%, 100% 54%, 100% 44%, 95% 44%, 95% 44%, 85% 44%, 85% 44%, 8% 44%, 0 70%);
    --clip-four: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    --clip-six: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
    --clip-seven: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);


    font-family: 'Cyber', sans-serif;
    color: var(--color);
    cursor: pointer;
    background: transparent;
    text-transform: uppercase;
    font-size: var(--font-size);
    outline: transparent;
    letter-spacing: 2px;
    position: relative;
    font-weight: 700;
    border: 0;
    min-width: 300px;
    height: 75px;
    line-height: 75px;
    transition: background 0.2s;
}

/* Hover and Active States for background color change */
.cybr-btn:hover {
    --primary-lightness: 45; 
}
.cybr-btn:active {
    --primary-lightness: 35; 
}

/* --- STACKED BACKGROUNDS (BORDER EFFECT) --- */

/* Base layers for background and border, using :before and :after */
.cybr-btn:after, .cybr-btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    clip-path: var(--clip);
    z-index: -1;
}

/* :before acts as the border layer, offset by --border variable */
.cybr-btn:before {
    background: var(--shadow-primary);
    transform: translate(var(--border), 0); 
}

/* :after is the main button background color */
.cybr-btn:after {
    background: var(--primary);
}

/* --- TAG STYLING (R25) --- */
.cybr-btn__tag {
    position: absolute;
    padding: 1px 4px;
    letter-spacing: 1px;
    line-height: 1;
    bottom: -5%;
    right: 5%;
    font-weight: normal;
    color: hsl(0, 0%, 0%);
    font-size: var(--label-size);
}

/* --- GLITCH EFFECT --- */

/* Glitch element setup - Hidden by default */
.cybr-btn__glitch {
    position: absolute;
    top: calc(var(--border) * -1);
    left: calc(var(--border) * -1);
    right: calc(var(--border) * -1);
    bottom: calc(var(--border) * -1);
    background: var(--shadow-primary);
    text-shadow: 2px 2px var(--shadow-primary), -2px -2px var(--shadow-secondary);
    clip-path: var(--clip);
    animation: glitch 2s infinite; 
    display: none; 
}

/* Make the glitch element visible on hover */
.cybr-btn:hover .cybr-btn__glitch {
    display: block;
}

/* Inner Glitch Layer (for depth) */
.cybr-btn__glitch:before {
    content: '';
    position: absolute;
    top: calc(var(--border) * 1);
    right: calc(var(--border) * 1);
    bottom: calc(var(--border) * 1);
    left: calc(var(--border) * 1);
    clip-path: var(--clip);
    background: var(--primary);
    z-index: -1;
}

/* --- KEYFRAME ANIMATION --- */

@keyframes glitch {
    0% { clip-path: var(--clip-one); }
    2%, 8% { 
        clip-path: var(--clip-two); 
        transform: translate(calc(var(--shimmy-distance) * -1%), 0); 
    }
    6% { 
        clip-path: var(--clip-two); 
        transform: translate(calc(var(--shimmy-distance) * 1%), 0); 
    }
    9% { 
        clip-path: var(--clip-two); 
        transform: translate(0, 0); 
    }
    10% { 
        clip-path: var(--clip-three); 
        transform: translate(calc(var(--shimmy-distance) * 1%), 0); 
    }
    13% { 
        clip-path: var(--clip-three); 
        transform: translate(0, 0); 
    }
    14%, 21% { 
        clip-path: var(--clip-four);
    }
    25% { 
        clip-path: var(--clip-six); 
        transform: translate(calc(var(--shimmy-distance) * 1%), 0); 
    }
    30% { 
        clip-path: var(--clip-six); 
        transform: translate(calc(var(--shimmy-distance) * -1%), 0); 
    }
    50% { 
        clip-path: var(--clip-six); 
        transform: translate(0, 0); 
    }
    55% { 
        clip-path: var(--clip-seven); 
        transform: translate(calc(var(--shimmy-distance) * 1%), 0); 
    }
    60% { 
        clip-path: var(--clip-seven); 
        transform: translate(0, 0); 
    }
    31%, 61%, 100% { 
        clip-path: var(--clip-four);
    }
}
