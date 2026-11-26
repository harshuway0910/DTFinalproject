import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Share2, Activity, Award, TrendingDown, Target, Copy } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const Dashboard = ({ user }) => {
  const levelTitles = {
    1: "🌱 Seedling",
    2: "🌿 Eco Warrior",
    3: "🌳 Green Guardian",
    4: "⚡ Carbon Crusher",
    5: "🌍 Planet Protector"
  };
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [missions, setMissions] = useState([
    { id: 1, text: t('mission_1'), done: false },
    { id: 2, text: t('mission_2'), done: false },
    { id: 3, text: t('mission_3'), done: false }
  ]);
  const [shareInsights, setShareInsights] = useState({ shares: 12, views: 156, registrations: 5 });

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/user_data?email=${user.email}`)
        .then(res => {
          if (res.data.success) {
            const formattedHistory = res.data.history.map((h, i) => ({
              name: `Calc ${i + 1}`,
              footprint: h.total_footprint,
              average: 36 // Updated average baseline
            }));
            setHistory(formattedHistory);

            const newMissions = [...missions];
            if (formattedHistory.length > 0) newMissions[0].done = true;
            if (formattedHistory.some(h => h.footprint < 50)) newMissions[1].done = true;
            if (user.level >= 2) newMissions[2].done = true;
            setMissions(newMissions);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard! Shared successfully.");
    setShareInsights({ ...shareInsights, shares: shareInsights.shares + 1 });
  };

  const handleMissionToggle = (id) => {
    const updated = missions.map(m => m.id === id ? { ...m, done: !m.done } : m);
    setMissions(updated);
  };

  if (!user) {
    return <div className="text-center py-20 text-xl font-bold text-muted">{t('login_to_dashboard')}</div>;
  }

  const xp = user.xp || 0;
  const level = user.level || 1;
  const nextLevelXp = level * 1000;
  const progress = (xp / nextLevelXp) * 100;

  const latestFootprint = history.length > 0 ? history[history.length - 1].footprint.toFixed(2) : '0';

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="bg-hoverBg border border-borderColor p-4 rounded-2xl">
            <Activity className="text-primary" size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase tracking-wider">{t('total_calculations')}</p>
            <p className="text-3xl font-bold font-poppins text-foreground">{history.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-secondary">
          <div className="bg-hoverBg border border-borderColor p-4 rounded-2xl">
            <Target className="text-secondary" size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase tracking-wider">{t('current_level')}</p>
            <p className="text-3xl font-bold font-poppins text-secondary">{level}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="bg-hoverBg border border-borderColor p-4 rounded-2xl">
            <TrendingDown className="text-foreground" size={32} />
          </div>
          <div>
            <p className="text-muted text-sm font-semibold uppercase tracking-wider">{t('latest_footprint')}</p>
            <p className="text-3xl font-bold font-poppins text-foreground">{latestFootprint} <span className="text-lg text-muted">kg</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-40 h-40 mb-6 relative">
            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(57,255,20,0.3)] animate-pulse"></div>
            <CircularProgressbar
              value={progress}
              text={`${t('level')} ${level}`}
              styles={buildStyles({
                textColor: 'var(--text-main)',
                pathColor: 'var(--primary-accent)',
                trailColor: 'var(--border-color)',
                textSize: '20px',
              })}
            />
          </div>
          <h3 className="text-2xl font-bold font-poppins text-foreground">{user.name}</h3>
          <p className="text-primary font-semibold text-sm mt-2 bg-primary/10 px-3 py-1 rounded-full"><p>{xp} / {nextLevelXp} {t('xp')}</p>
            <p style={{ color: 'rgba(4, 36, 36, 1)', fontWeight: 'bold', marginTop: '4px' }}>
              {levelTitles[level] || "🌱 Seedling"}
            </p></p>
        </div>

        {/* Missions & Badges */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl flex flex-col">
          <h3 className="text-2xl font-bold font-poppins mb-6 flex items-center gap-3 text-foreground">
            <Award className="text-[#F59E0B]" size={28} /> {t('missions_title')}
          </h3>
          <div className="space-y-4">
            {missions.map(m => (
              <label key={m.id} className="flex items-center gap-4 cursor-pointer p-4 bg-background border border-borderColor hover:bg-hoverBg rounded-2xl transition group">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => handleMissionToggle(m.id)}
                    className="appearance-none w-6 h-6 border-2 border-muted rounded cursor-pointer checked:bg-primary checked:border-primary transition"
                  />
                  {m.done && <svg className="absolute w-4 h-4 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <span className={`text-lg font-medium transition ${m.done ? 'text-muted line-through' : 'text-foreground'}`}>{m.text}</span>
                {m.done && (
                  <span className="ml-auto text-xs bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border border-[#F59E0B]/30 animate-slide-up">
                    🏅 {t('badge_earned')}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-xl font-bold font-poppins mb-2 text-foreground">{t('chart_title')} (1.9t/yr)</h3>
          <p className="text-muted text-sm mb-6">Lower is better. The yellow dashed line is the Indian average (~56 kg/week).</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history.length > 0 ? history : [{ name: 'No data', footprint: 0, average: 56 }]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }} />
                <Legend />
                <Line type="monotone" dataKey="footprint" name={t('your_footprint')} stroke="var(--primary-accent)" strokeWidth={4} dot={{ r: 6, fill: 'var(--bg-color)', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="average" name={t('avg_human')} stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-poppins mb-6 text-foreground">{t('share_insights')}</h3>
            <div className="flex flex-col gap-4 mb-8">
              <div className="bg-background border border-borderColor p-4 rounded-2xl flex justify-between items-center">
                <span className="text-muted font-medium">{t('profile_shares')}</span>
                <span className="text-2xl font-bold text-foreground">{shareInsights.shares}</span>
              </div>
              <div className="bg-background border border-borderColor p-4 rounded-2xl flex justify-between items-center">
                <span className="text-muted font-medium">{t('profile_views')}</span>
                <span className="text-2xl font-bold text-foreground">{shareInsights.views}</span>
              </div>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-primary font-medium">{t('registrations')}</span>
                <span className="text-2xl font-bold text-primary">{shareInsights.registrations}</span>
              </div>
            </div>
          </div>
          <button onClick={handleShare} className="w-full flex justify-center items-center gap-2 bg-primary text-white dark:text-background font-bold text-lg px-6 py-4 rounded-xl hover:bg-secondary transition shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Copy size={20} /> {t('share_profile')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
