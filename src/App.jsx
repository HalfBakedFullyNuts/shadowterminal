import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SessionList from './components/SessionList';
import CreateSession from './components/CreateSession';
import SessionDetails from './components/SessionDetails';
import DriveView from './components/DriveView';
import CharacterList from './components/CharacterList';
import CharacterSheet from './components/CharacterSheet/CharacterSheet';

import Dashboard from './components/Dashboard';
import CampaignList from './components/CampaignList';
import CampaignDetails from './components/CampaignDetails';
import Settings from './components/Settings';

// Dashboard component imported from ./components/Dashboard

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

import { isFirebaseConfigured } from './lib/firebase';
import SetupRequired from './components/SetupRequired';

function App() {
  if (!isFirebaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="create-session" element={<CreateSession />} />

            <Route path="sessions/:sessionId" element={<SessionDetails />} />
            <Route path="session/:sessionId" element={<SessionDetails />} /> {/* Legacy support or redirect */}
            <Route path="campaigns" element={<CampaignList />} />
            <Route path="campaigns/:campaignId" element={<CampaignDetails />} />
            {/* NPC and Clue routes redirect to campaign with hash for scroll */}
            <Route path="campaigns/:campaignId/npcs/new" element={<CampaignDetails autoOpenNpc />} />
            <Route path="campaigns/:campaignId/clues/new" element={<CampaignDetails autoOpenClue />} />
            <Route path="drive" element={<DriveView />} />
            <Route path="characters" element={<CharacterList />} />
            <Route path="characters/:characterId" element={<CharacterSheet />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
