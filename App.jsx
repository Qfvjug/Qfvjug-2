import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Downloads from './pages/Downloads.jsx';
import VIP from './pages/VIP.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="videos" element={<Videos />} />
                <Route path="downloads" element={<Downloads />} />
                <Route path="vip" element={<VIP />} />
                <Route path="contact" element={<Contact />} />
                {/* Fallback für nicht gefundene Routen */}
                <Route path="*" element={<Home />} />
              </Route>
              {/* Admin-Route außerhalb des Layouts */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
