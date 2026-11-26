import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Leaf, UserCircle, Menu, Sun, Moon } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, openAuth, user, theme, setTheme }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard') },
    { id: 'calculator', label: t('nav_calculator') },
    { id: 'learn', label: t('nav_learn') },
    { id: 'leaderboard', label: t('nav_leaderboard') },
    { id: 'profile', label: t('nav_profile') },
    { id: 'help', label: t('nav_help') },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-40 px-6 py-4 mx-4 mt-4 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <ShieldCheck size={32} className="text-secondary" />
          <Leaf size={16} className="text-primary absolute bottom-0 right-[-4px]" />
        </div>
        <span className="text-2xl font-bold font-poppins">
          <span className="text-foreground">{t('app_title').split(' ')[0]}</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {t('app_title').split(' ')[1]}
          </span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`font-medium transition-colors ${activeTab === item.id ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-foreground'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-hoverBg text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition border border-borderColor"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button 
          onClick={toggleLanguage}
          className="px-3 py-1 rounded-full bg-hoverBg text-foreground text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition border border-borderColor"
        >
          {i18n.language === 'en' ? 'HI' : 'EN'}
        </button>
        
        {!user ? (
          <button 
            onClick={openAuth}
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-secondary text-background px-5 py-2 rounded-xl transition-all shadow-md font-bold"
          >
            <UserCircle size={20} />
            <span>{t('login')}</span>
          </button>
        ) : (
          <button 
            onClick={() => setActiveTab('profile')}
            className="hidden md:flex items-center gap-2 bg-hoverBg text-primary px-4 py-2 rounded-xl font-semibold border border-borderColor hover:bg-black/10 dark:hover:bg-white/20 transition"
          >
            <UserCircle size={20} />
            <span>{user.name}</span>
          </button>
        )}
        <button className="md:hidden text-foreground p-2">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
