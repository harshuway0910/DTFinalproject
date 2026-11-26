import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star } from 'lucide-react';
import { API_BASE_URL } from '../api';

const Leaderboard = ({ user }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/leaderboard`);
        setLeaders(res.data.leaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-foreground animate-pulse">Loading Leaderboard...</div>;
  }

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold font-poppins mb-4 flex items-center justify-center gap-3 text-foreground">
          <Trophy className="text-[#F59E0B]" size={40} /> Top Eco Warriors
        </h2>
        <p className="text-muted">Compete with others and lower your footprint to climb the ranks!</p>
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12 mt-16 px-4">
          
          {/* 2nd Place */}
          {top3[1] && (
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-hoverBg border-4 border-[#9CA3AF] flex items-center justify-center text-3xl font-bold text-[#9CA3AF] z-10 relative">
                  {top3[1].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Medal className="text-[#9CA3AF]" size={32} />
                </div>
              </div>
              <div className="glass-panel w-full h-40 rounded-t-2xl border-t-4 border-[#9CA3AF] flex flex-col items-center justify-start pt-6 bg-gradient-to-t from-transparent to-[#9CA3AF]/10">
                <p className="text-foreground font-bold text-lg">{top3[1].name}</p>
                <p className="text-muted font-semibold text-sm mt-1">{top3[1].xp} XP</p>
                <p className="text-xs text-muted mt-2">Lvl {top3[1].level}</p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="w-full md:w-1/3 flex flex-col items-center -order-1 md:order-none z-10">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-[#F59E0B]/10 border-4 border-[#F59E0B] flex items-center justify-center text-5xl font-bold text-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.4)] z-10 relative">
                  {top3[0].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <Trophy className="text-[#F59E0B]" size={48} />
                </div>
              </div>
              <div className="glass-panel w-full h-48 rounded-t-2xl border-t-4 border-[#F59E0B] flex flex-col items-center justify-start pt-6 bg-gradient-to-t from-transparent to-[#F59E0B]/20">
                <p className="text-foreground font-bold text-xl">{top3[0].name}</p>
                <p className="text-[#F59E0B] font-bold text-lg mt-1">{top3[0].xp} XP</p>
                <p className="text-sm text-muted mt-2">Lvl {top3[0].level}</p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-hoverBg border-4 border-[#B45309] flex items-center justify-center text-3xl font-bold text-[#B45309] z-10 relative">
                  {top3[2].name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Medal className="text-[#B45309]" size={32} />
                </div>
              </div>
              <div className="glass-panel w-full h-32 rounded-t-2xl border-t-4 border-[#B45309] flex flex-col items-center justify-start pt-6 bg-gradient-to-t from-transparent to-[#B45309]/10">
                <p className="text-foreground font-bold text-lg">{top3[2].name}</p>
                <p className="text-muted font-semibold text-sm mt-1">{top3[2].xp} XP</p>
                <p className="text-xs text-muted mt-2">Lvl {top3[2].level}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="divide-y divide-borderColor">
          {rest.map((entry, index) => {
            const rank = index + 4;
            const isMe = user && user.email === entry.email;
            return (
              <div key={index} className={`flex items-center justify-between p-6 hover:bg-hoverBg transition ${isMe ? 'bg-primary/10 border-l-4 border-primary' : ''}`}>
                <div className="flex items-center gap-6">
                  <span className="text-muted font-bold text-xl w-6 text-center">{rank}</span>
                  <div className="w-10 h-10 rounded-full bg-hoverBg flex items-center justify-center font-bold text-foreground uppercase border border-borderColor">
                    {entry.name.charAt(0)}
                  </div>
                  <div>
                  <span className={`font-semibold text-lg ${isMe ? 'text-primary' : 'text-foreground'}`}>
                    {entry.name} {isMe && '(You)'}
                  </span>
                  <p className="text-xs text-muted">Level {entry.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-primary" size={16} />
                  <span className="font-bold font-poppins text-foreground">{entry.xp} XP</span>
                </div>
              </div>
            );
          })}
          {rest.length === 0 && <div className="p-8 text-center text-muted">No other users yet. Keep inviting friends!</div>}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
