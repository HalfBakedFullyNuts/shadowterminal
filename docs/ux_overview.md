# Shadowterminal UX Overview

This document outlines the current user experience, available pages, and user flows within the Shadowterminal application.

## 1. Application Structure & Pages

The application is secured by a `PrivateRoute` wrapper, requiring authentication for all pages except Login.

### Core Pages

| Route | Page Name | Function | Key Data Displayed |
|-------|-----------|----------|--------------------|
| `/login` | **Login** | User authentication entry point. | Login form (Email/Password). |
| `/` | **Dashboard** | Central hub for the user. Displays overview of activities. | Recent sessions, next mission countdown, active campaigns, quick actions. |
| `/create-session` | **Create Session** | Form to initiate a new game session. | Date picker, type selection (In-person/Online), location input, description. |
| `/sessions/:sessionId` | **Session Details** | Detailed view of a specific session. | Session status, proposed dates, availability matrix, participants, Google Calendar sync status. |
| `/campaigns` | **Campaign List** | List of all campaigns the user is part of. | Campaign names, roles, next session dates. |
| `/campaigns/:campaignId` | **Campaign Details** | Comprehensive view of a campaign. | GM notes, player list, NPC database, mission logs, intel/clues. |
| `/drive` | **Drive View** | File and asset management interface. | Folders, files, upload options. |
| `/characters` | **Character List** | Registry of user's characters. | Character names, roles, archetypes, status. |
| `/characters/:characterId` | **Character Sheet** | Detailed character profile and stats. | Attributes, skills, inventory, cyberware, backstory. |
| `/settings` | **Settings** | System configuration (Currently Locked). | Placeholder for future settings. |

## 2. User Flows

### Authentication Flow
1.  **Entry**: User lands on any protected route.
2.  **Redirect**: If unauthenticated, redirected to `/login`.
3.  **Action**: User enters credentials and submits.
4.  **Success**: Redirected to `/` (Dashboard).

### Session Management Flow
1.  **Initiation**: User clicks "INITIATE SESSION" on Dashboard or Sidebar.
2.  **Creation**: User fills out details on `/create-session` and submits.
3.  **Coordination**: User is redirected to `/sessions/:sessionId`.
    *   **Share**: User shares URL with group.
    *   **Vote**: Participants toggle availability on dates.
    *   **Finalize**: Creator selects a final date.
4.  **Sync**: Users sync the finalized date to Google Calendar.

### Campaign Management Flow
1.  **Access**: User navigates to `/campaigns`.
2.  **Selection**: User selects a specific campaign.
3.  **Management**:
    *   **GM**: Adds NPCs, updates mission logs, manages clues.
    *   **Player**: Views public NPCs, reads mission logs, checks intel.

### Character Management Flow
1.  **Access**: User navigates to `/characters`.
2.  **Create/Select**: User adds a new character or selects an existing one.
3.  **Edit**: User updates stats, inventory, and details on `/characters/:characterId`.

## 3. Data Availability & State

### Global State (Contexts)
*   **AuthContext**: Provides `currentUser` object (uid, email).

### Data Models (Firestore)
*   **Users**: Profile data, display names.
*   **Sessions**: Title, description, type, location, proposedDates (array), finalDate, status (open/finalized), createdBy.
*   **Campaigns**: Title, description, gmId, players (array of IDs).
    *   *Sub-collections*: `npcs`, `missions`, `clues`.
*   **Characters**: Name, archetype, stats, inventory, campaignId (link).

## 4. Design Opportunities

*   **Dashboard**: Currently a simple list. Could be enhanced with a "Mission Control" aesthetic, showing live stats, holographic-style widgets for next session, and quick-access "decks" for characters.
*   **Session Details**: The availability matrix is functional but could be visualized as a "Netrunner" grid or tactical map.
*   **Campaign View**: The NPC manager and Intel sections are text-heavy. These could be redesigned as "Dossiers" or "Evidence Boards" with visual connections.
