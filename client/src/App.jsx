import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SinglePlayer from './pages/SinglePlayer';
import MultiplayerLobby from './pages/MultiplayerLobby';
import MultiplayerGame from './pages/MultiplayerGame';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TournamentBrowser from './pages/TournamentBrowser';
import TournamentDetails from './pages/TournamentDetails';
import Leaderboards from './pages/Leaderboards';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/single" element={<SinglePlayer />} />
            <Route path="/multi" element={<MultiplayerLobby />} />
            <Route path="/game/:roomId" element={<MultiplayerGame />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/tournaments" element={<TournamentBrowser />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
