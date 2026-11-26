import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { User, Mail, Target, Bell, LogOut, Save } from 'lucide-react';
import { API_BASE_URL } from '../api';

const Profile = ({ user, setUser, handleLogout }) => {
  const { t } = useTranslation();
  const [goal, setGoal] = useState(user?.goal || '');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [message, setMessage] = useState('');

  if (!user) return <div className="text-center py-10 font-bold text-muted">{t('login_to_dashboard')}</div>;

  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/settings`, {
        email: user.email,
        goal: Number(goal),
        notifications
      });
      const updated = { ...user, goal: Number(goal), notifications };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage(t('settings_saved', 'Settings saved successfully!'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(t('settings_failed', 'Failed to save settings.'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="glass-panel p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold font-poppins text-foreground mb-8 flex items-center gap-3">
          <User className="text-secondary w-8 h-8" /> {t('profile_title')}
        </h2>

        <div className="space-y-6">
          <div className="bg-hoverBg p-6 rounded-2xl border border-borderColor">
            <h3 className="text-lg font-bold font-poppins text-foreground mb-4 border-b border-borderColor pb-2">{t('signup_details', 'Signup Details')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted text-sm">{t('name')}</p>
                <p className="font-semibold text-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-muted text-sm">{t('email')}</p>
                <p className="font-semibold text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-muted text-sm">{t('age')}</p>
                <p className="font-semibold text-foreground">{user.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted text-sm">{t('joined_at', 'Joined At')}</p>
                <p className="font-semibold text-foreground">{user.created_at || t('recently', 'Recently')}</p>
              </div>
            </div>
          </div>

          <div className="bg-hoverBg p-6 rounded-2xl border border-borderColor">
            <h3 className="text-lg font-bold font-poppins text-foreground mb-4 border-b border-borderColor pb-2">{t('preferences', 'Preferences')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-muted font-medium mb-2">
                  <Target size={18} /> {t('goal_label')}
                </label>
                <input 
                  type="number" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-background border border-borderColor text-foreground rounded-xl py-2 px-4 focus:ring-1 focus:ring-primary outline-none transition"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-muted font-medium">
                  <Bell size={18} /> {t('notifications')}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-borderColor peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>
            </div>

            {message && <div className="mt-4 text-sm text-primary font-bold">{message}</div>}

            <button onClick={handleSave} className="mt-6 w-full flex items-center justify-center gap-2 bg-secondary hover:bg-[#27ae60] text-white dark:text-background font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(46,204,113,0.3)]">
              <Save size={20} /> {t('save_settings')}
            </button>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] font-bold py-3 rounded-xl transition border border-[#EF4444]/30">
            <LogOut size={20} /> {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
