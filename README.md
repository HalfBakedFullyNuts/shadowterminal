# Shadowterminal

**Shadowterminal** is a futuristic, cyberpunk-themed campaign management dashboard designed for **Shadowrun 4th Edition (20th Anniversary)**. It serves as a central hub for Game Masters (GMs) and players to manage campaigns, track characters, schedule sessions, and organize intel.

![Shadowterminal Dashboard](https://via.placeholder.com/800x450.png?text=Shadowterminal+Dashboard+Preview)

## 🚀 Features

### 🖥️ Mission Control Dashboard
- **Active Operations**: View upcoming sessions and their status.
- **Action Center**: Quick access to active votes and scheduling conflicts.
- **Runner Status**: Real-time overview of character stats (Physical/Stun tracks, Edge, Essence).
- **Recent Intel**: Quick links to recently viewed NPCs, clues, and files.

### 📂 Campaign Management
- **Campaign Details**: Comprehensive view of the current campaign.
- **Personnel Database (NPCs)**: Manage NPCs with details like role, location, connections, and loyalty ratings.
- **Intel & Clues**: Track mission clues, intercepts, and physical evidence. GMs can selectively reveal intel to players.
- **Google Drive Integration**: Link a Google Drive folder to the campaign to access and view mission files (PDFs, images) directly within the app.

### 👤 Character Sheet
- **SR4A Compliant**: Digital character sheet modeled after the Shadowrun 4th Ed Anniversary sheet.
- **Editable Fields**: Manage Attributes, Skills, Qualities, Gear, and Cyberware.
- **Calculated Stats**: Automatic calculation of derived stats (Initiative, Commlink Response, etc.).
- **Condition Monitors**: Track Physical and Stun damage with penalties.

### 📅 Session Scheduling
- **Availability Voting**: Players vote on proposed session dates.
- **Consensus Tracking**: Automatic identification of best dates based on quorum (N-1).
- **Conflict Warnings**: Alerts for scheduling conflicts (e.g., multiple sessions in one week).

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS v4 (using `@theme` variables for dynamic cyberpunk theming)
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Authentication)
- **Integrations**: Google Drive API (v3)
- **Animation**: Framer Motion, CSS Animations

## 🔧 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/shadowterminal.git
    cd shadowterminal
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory with your Firebase and Google API credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    VITE_GOOGLE_API_KEY=your_google_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 🎨 Design System

The application uses a custom cyberpunk design system built on Tailwind v4 CSS variables.

- **Colors**:
    - `accent-green` (#00f0ff) - Primary interaction color (Cyber Cyan)
    - `accent-red` (#ff003c) - Danger/Alerts (Cyber Magenta)
    - `accent-amber` (#fcee0a) - Warnings/Intel (Cyber Yellow)
    - `panel-background` (#0a0a0a) - Component backgrounds
- **Fonts**:
    - `font-heading`: "Orbitron"
    - `font-body`: "Rajdhani"
    - `font-mono`: "Share Tech Mono"

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
