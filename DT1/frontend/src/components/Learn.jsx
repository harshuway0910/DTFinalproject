import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, AlertTriangle, ArrowRightCircle, Bike, Sun, Leaf, ShoppingBag, Recycle, Plane } from 'lucide-react';

const Learn = () => {
  const { t } = useTranslation();
  const solutions = [
    {
      id: 1,
      title: t('solution_1_title'),
      icon: <Bike className="text-foreground" size={28} />,
      savings: t('solution_1_save'),
      difficulty: t('difficulty_lifestyle'),
      diffColor: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
      bullets: [t('solution_1_tip1'), t('solution_1_tip2')]
    },
    {
      id: 2,
      title: t('solution_2_title'),
      icon: <Sun className="text-foreground" size={28} />,
      savings: t('solution_2_save'),
      difficulty: t('difficulty_medium'),
      diffColor: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
      bullets: [t('solution_2_tip1'), t('solution_2_tip2')]
    },
    {
      id: 3,
      title: t('solution_3_title'),
      icon: <Leaf className="text-foreground" size={28} />,
      savings: t('solution_3_save'),
      difficulty: t('difficulty_medium'),
      diffColor: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
      bullets: [t('solution_3_tip1'), t('solution_3_tip2')]
    },
    {
      id: 4,
      title: t('solution_4_title'),
      icon: <ShoppingBag className="text-foreground" size={28} />,
      savings: t('solution_4_save'),
      difficulty: t('difficulty_easy'),
      diffColor: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
      bullets: [t('solution_4_tip1'), t('solution_4_tip2')]
    },
    {
      id: 5,
      title: t('solution_5_title'),
      icon: <Recycle className="text-foreground" size={28} />,
      savings: t('solution_5_save'),
      difficulty: t('difficulty_easy'),
      diffColor: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
      bullets: [t('solution_5_tip1'), t('solution_5_tip2')]
    },
    {
      id: 6,
      title: t('solution_6_title'),
      icon: <Plane className="text-foreground" size={28} />,
      savings: t('solution_6_save'),
      difficulty: t('difficulty_lifestyle'),
      diffColor: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
      bullets: [t('solution_6_tip1'), t('solution_6_tip2')]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold font-poppins mb-4 text-foreground">{t('learn_title')}</h2>
        <p className="text-lg text-muted">{t('learn_subtitle')}</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold font-poppins mb-4 flex items-center gap-2 text-foreground"><BookOpen className="text-secondary" /> {t('history_title')}</h3>
          <p className="text-muted leading-relaxed mb-4">
            {t('history_text')}
          </p>
        </div>
        <div className="md:w-1/2 rounded-2xl overflow-hidden border border-borderColor">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" alt="Nature mountains" className="w-full h-auto object-cover hover:scale-105 transition duration-500 opacity-80 hover:opacity-100" />
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row-reverse gap-8 items-center">
        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold font-poppins mb-4 flex items-center gap-2 text-foreground"><AlertTriangle className="text-[#F59E0B]" /> {t('causes_title')}</h3>
          <p className="text-muted leading-relaxed">
            {t('causes_text')}
          </p>
        </div>
        <div className="md:w-1/2 rounded-2xl overflow-hidden border border-borderColor">
          <img src="https://share.google/W8OrXB7xFeXw9iwuG" alt="Industrial smoke" className="w-full h-auto object-cover hover:scale-105 transition duration-500 opacity-80 hover:opacity-100" />
        </div>
      </div>

      {/* NEW Green Solutions Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold font-poppins mb-8 text-center text-foreground">{t('solutions_section_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map(sol => (
            <div key={sol.id} className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-hoverBg p-3 rounded-2xl border border-borderColor">
                    {sol.icon}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sol.diffColor}`}>
                    {sol.id === 1 || sol.id === 6 ? t('difficulty_lifestyle') : sol.id === 2 || sol.id === 3 ? t('difficulty_medium') : t('difficulty_easy')}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-poppins mb-4 text-foreground">{sol.title}</h3>
                <ul className="space-y-2 mb-6">
                  {sol.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-muted text-sm">
                      <span className="text-secondary mt-0.5">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/10 border border-primary/20 text-primary font-bold px-4 py-2 rounded-xl text-center">
                {sol.id === 1 ? t('solution_1_save') : sol.id === 2 ? t('solution_2_save') : sol.id === 3 ? t('solution_3_save') : sol.id === 4 ? t('solution_4_save') : sol.id === 5 ? t('solution_5_save') : t('solution_6_save')}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Learn;
