# Shadowterminal Architecture

This document provides a high-level overview of the technical architecture for **Shadowterminal**, a React-based campaign manager for Shadowrun 4th Edition.

## 🏗️ High-Level Overview

Shadowterminal is a **Single Page Application (SPA)** built with **React** and **Vite**. It relies on **Firebase** for backend services (Authentication, Firestore Database) and integrates with the **Google Drive API** for file management. The UI is styled using **Tailwind CSS v4** with a custom design system.

## 📂 Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── Campaign/       # Campaign-specific components (NPCManager, ClueManager)
│   ├── CharacterSheet/ # Character sheet components (Header, Tabs, etc.)
│   ├── Dashboard/      # Dashboard widgets (RunnerStatus, ActionCenter)
│   ├── Drive/          # Google Drive integration components
│   └── ...             # Shared components (Layout, ErrorBoundary)
├── hooks/              # Custom React hooks (useGoogleDrive, useCharacterData)
├── lib/                # Utility libraries and configurations
│   ├── firebase.js     # Firebase initialization and exports
│   ├── sr4/            # Shadowrun 4th Ed rules and data models
│   └── ...
├── pages/              # Top-level page components (Login, Dashboard, etc.)
├── App.jsx             # Main application entry point and routing
├── index.css           # Tailwind v4 configuration and global styles
└── main.jsx            # React DOM rendering
```

## 🔐 Authentication & Security

- **Firebase Authentication**: Handles user sign-up and login.
- **Google OAuth**: Used for Google Drive integration. The application requests the `drive.readonly` scope to access files in a specific folder.
- **Route Protection**: `Layout.jsx` checks for an authenticated user and redirects to `/login` if necessary.

## 💾 Data Model (Firestore)

The application uses a NoSQL document structure in Firestore.

### Collections

- **`users/{uid}`**
    - Stores user profile data.
    - Subcollections or fields link to owned characters and campaigns.

- **`campaigns/{campaignId}`**
    - Stores campaign metadata (title, description, GM ID).
    - **Subcollections**:
        - `npcs`: Stores NPC data (name, role, stats, visibility).
        - `clues`: Stores intel/clues (content, type, revealed status).
        - `sessions`: Stores session data (dates, location, notes).

- **`characters/{characterId}`**
    - Stores full character sheet data (attributes, skills, gear).
    - Follows the SR4A data model defined in `src/lib/sr4/characterModel.js`.

## 🎨 Design System (Tailwind v4)

The project uses Tailwind CSS v4 with a custom configuration defined in `src/index.css` using the `@theme` directive.

### Key Tokens

- **Colors**: Semantic names link to hex values (e.g., `--color-accent-green` -> `#00f0ff`).
- **Typography**: Custom font families for headers (`Orbitron`), body (`Rajdhani`), and code (`Share Tech Mono`).
- **Effects**: Custom utilities for text glow (`text-glow-green`) and box shadows.

### Component Pattern

Components are built to be modular and theme-aware. They consume these CSS variables to ensure consistency.
Example:
```jsx
<div className="border border-border bg-panel-background/50 text-primary-text">
  <h1 className="font-heading text-accent-green">Title</h1>
</div>
```

## 🔌 Integrations

### Google Drive

- **Hook**: `useGoogleDrive.js` manages the GAPI client initialization and token handling.
- **Flow**:
    1.  User clicks "Link Drive Folder" in Campaign Details.
    2.  App requests OAuth consent.
    3.  App lists files from the specified Folder ID.
    4.  Files are displayed in `DriveBrowser` with links to open them in a new tab.

## 🔄 State Management

- **Local State**: `useState` for component-level UI state (forms, toggles).
- **Server State**: Real-time listeners (`onSnapshot`) from Firebase Firestore keep the UI in sync with the database.
- **Context**: (If applicable) Used for global themes or auth state (though currently handled via direct Firebase auth listeners in hooks).

## 🚀 Deployment

The application is built using `vite build`, which produces a static `dist/` folder. This can be deployed to any static hosting provider (Firebase Hosting, Vercel, Netlify).
