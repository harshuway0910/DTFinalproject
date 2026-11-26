import React, { useEffect, useState } from 'react';
import { ShieldCheck, Leaf, Globe, Zap, Recycle, Sun, Moon } from 'lucide-react';

const LandingPage = ({ openAuth, setActiveTab, theme, setTheme }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles for the floating effect
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden w-full transition-colors duration-300">
      {/* Top Controls: Theme Toggle */}
      {setTheme && (
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-3 rounded-full bg-hoverBg text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-all border border-borderColor backdrop-blur-md shadow-md flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-emerald-700" />}
            <span className="text-xs font-semibold uppercase tracking-wider">{theme}</span>
          </button>
        </div>
      )}
      {/* Floating Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="floating-particle text-primary/30"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        >
          <Leaf size={p.size} />
        </div>
      ))}

      <div className="z-10 text-center flex flex-col items-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <ShieldCheck size={64} className="text-secondary" />
            <Leaf size={32} className="text-primary absolute bottom-0 right-[-10px]" />
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6">
          <span className="text-foreground">Footprint</span>{' '}
          <span className="text-primary drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">
            Fighter
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted mb-10">
          Know Your Impact. Own Your Change.
        </p>

        {/* Stat Badge */}
        <div className="inline-flex items-center gap-2 bg-hoverBg border border-borderColor backdrop-blur-md px-6 py-3 rounded-full mb-12 shadow-[0_0_15px_rgba(46,204,113,0.2)] animate-pulse">
          <span className="text-lg text-foreground">🌍 Average Indian emits 1.9 tonnes CO₂/year — What's yours?</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <button 
            onClick={openAuth}
            className="bg-primary text-white dark:text-background font-bold text-lg px-8 py-4 rounded-xl hover:bg-secondary transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(57,255,20,0.5)]"
          >
            Calculate My Footprint →
          </button>
          <button 
            onClick={() => setActiveTab('learn')}
            className="bg-transparent border-2 border-borderColor text-foreground font-bold text-lg px-8 py-4 rounded-xl hover:bg-hoverBg transition-all"
          >
            Learn More
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 text-muted">
          <div className="flex items-center gap-2">
            <Globe className="text-secondary" size={24} />
            <span className="font-semibold">Science-backed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500" size={24} />
            <span className="font-semibold">Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <Recycle className="text-primary" size={24} />
            <span className="font-semibold">Real Solutions</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
