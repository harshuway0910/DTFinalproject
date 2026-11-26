import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import Learn from './components/Learn';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Help from './components/Help';
import Chatbot from './components/Chatbot';
import LandingPage from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Check if user is in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Apply theme to HTML tag
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsAuthOpen(false);
    setActiveTab('dashboard'); // reset to dashboard
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'calculator': return <Calculator user={user} setUser={setUser} />;
      case 'learn': return <Learn />;
      case 'leaderboard': return <Leaderboard user={user} />;
      case 'profile': return <Profile user={user} setUser={setUser} handleLogout={handleLogout} />;
      case 'help': return <Help />;
      default: return <Dashboard user={user} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <LandingPage 
          openAuth={() => setIsAuthOpen(true)} 
          setActiveTab={setActiveTab} 
          theme={theme}
          setTheme={setTheme}
        />
        <Chatbot />
        {isAuthOpen && (
          <AuthModal onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAuth={() => setIsAuthOpen(true)}
        user={user}
        theme={theme}
        setTheme={setTheme}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-fade-in-up">
          {renderTab()}
        </div>
      </main>

      <Chatbot />

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
