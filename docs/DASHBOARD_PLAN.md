# Dashboard 2.0 "Mission Control" - Enhancement Plan

## Overview
The goal is to upgrade the landing screen into a functional and immersive "Mission Control" dashboard.

## Tickets

### [FE-001] Hero Section - "The Next Run"
**Priority:** High
**Description:**
Display the immediate next confirmed session prominently.
**Acceptance Criteria:**
- [ ] Queries `sessions` collection for the next `finalized` session.
- [ ] Displays Countdown (Days/Hours).
- [ ] Shows Location and Time.
- [ ] "Access Briefing" button links to `/session/:id`.
- [ ] Handles "No upcoming missions" state gracefully.

### [FE-002] Action Center - "Urgent Comms"
**Priority:** High
**Description:**
A consolidated feed of items requiring user attention.
**Acceptance Criteria:**
- [ ] **Pending Votes**: List sessions where the user needs to vote on a date.
- [ ] **New Intel**: List recently added Clues or NPCs.
- [ ] **System Alerts**: Placeholder for admin messages or system status.

### [FE-003] Runner Status - "Asset Overview"
**Priority:** Medium
**Description:**
A quick-glance view of the active character's status.
**Acceptance Criteria:**
- [ ] Fetches the user's primary character.
- [ ] Displays: Name, Archetype, Portrait.
- [ ] Displays Stats: Nuyen, Karma (if available in schema).
- [ ] Link to full Character Sheet.

### [FE-004] UI/UX - Cyberpunk Polish
**Priority:** Low (Ongoing)
**Description:**
Enhance the visual fidelity to match the "Shadowterminal" aesthetic.
**Acceptance Criteria:**
- [ ] Implement CRT scanline overlay (optional toggle).
- [ ] Add micro-animations for data loading.
- [ ] "Glitch" effects on critical alerts.
