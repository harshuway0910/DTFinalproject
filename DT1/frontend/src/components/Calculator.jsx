import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Car, ShoppingBag, Zap, Trash2, Utensils, Flame, ArrowRight, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../api';

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toFixed(2)}</span>;
};

const Calculator = ({ user, setUser }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    travel: 0,
    shopping: 0,
    electricity: 0,
    waste: 0,
    food: 'vegetarian',
    cooking_gas: 0
  });
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'food' ? value : Number(value) 
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      alert(t('login_to_calculate'));
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/calculate`, {
        email: user.email,
        ...formData
      });
      
      const tipsRes = await axios.post(`${API_BASE_URL}/api/tips`, formData);
      setTips(tipsRes.data);
      setResult(res.data);
      
      if (res.data.new_xp) {
        const updatedUser = { ...user, xp: res.data.new_xp, level: res.data.new_level };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const stepsData = [
    {
      id: 1,
      name: 'travel',
      titleKey: 'step_travel',
      label: t('travel_label'),
      icon: <Car size={32} className="text-secondary" />,
      unit: t('travel_unit'),
      helper: t('travel_helper')
    },
    {
      id: 2,
      name: 'shopping',
      titleKey: 'step_shopping',
      label: t('shopping_label'),
      icon: <ShoppingBag size={32} className="text-secondary" />,
      unit: t('shopping_unit'),
      helper: t('shopping_helper')
    },
    {
      id: 3,
      name: 'electricity',
      titleKey: 'step_electricity',
      label: t('electricity_label'),
      icon: <Zap size={32} className="text-secondary" />,
      unit: t('electricity_unit'),
      helper: t('electricity_helper'),
      tooltip: t('electricity_tooltip')
    },
    {
      id: 4,
      name: 'waste',
      titleKey: 'step_waste',
      label: t('waste_label'),
      icon: <Trash2 size={32} className="text-secondary" />,
      unit: t('waste_unit'),
      helper: t('waste_helper')
    },
    {
      id: 5,
      name: 'food',
      titleKey: 'step_food',
      label: t('food_label'),
      icon: <Utensils size={32} className="text-secondary" />,
      helper: t('food_helper'),
      isSelect: true
    },
    {
      id: 6,
      name: 'cooking_gas',
      titleKey: 'step_cooking_gas',
      label: t('cooking_gas_label'),
      icon: <Flame size={32} className="text-secondary" />,
      unit: t('cooking_gas_unit'),
      helper: t('cooking_gas_helper')
    }
  ];

  const currentStepData = stepsData[step - 1];

  if (result) {
    const isGood = result.total_footprint < 50;
    const isWarning = result.total_footprint >= 50 && result.total_footprint <= 150;
    const colorClass = isGood ? 'text-[#22C55E]' : isWarning ? 'text-[#F59E0B]' : 'text-[#EF4444]';

    const categoryLabels = {
      travel: t('breakdown_travel'),
      shopping: t('breakdown_shopping'),
      electricity: t('breakdown_electricity'),
      waste: t('breakdown_waste'),
      food: t('breakdown_food'),
      cooking_gas: t('breakdown_cooking_gas')
    };

    const chartData = result.breakdown
      ? Object.entries(result.breakdown)
          .map(([key, val]) => ({
            key,
            name: categoryLabels[key] || key,
            value: Number(val) || 0
          }))
          .sort((a, b) => b.value - a.value)
      : [];

    const biggestContributor = chartData.length > 0 ? chartData[0] : null;
    const tipsList = Array.isArray(tips) ? tips : (tips?.tips || []);
    const encouragement = tips?.encouragement_key;

    return (
      <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-poppins text-foreground">{t('calculator_title')}</h2>
          
          <div className="bg-hoverBg border border-borderColor rounded-2xl p-8 mb-8">
            <p className="text-muted text-lg mb-2">{t('result_title')}</p>
            <div className={`text-6xl font-bold font-poppins mb-4 ${colorClass}`}>
              <CountUp end={result.total_footprint} /> <span className="text-3xl">{t('result_unit')}</span>
            </div>
            <div className="inline-block bg-[#F59E0B]/20 text-[#F59E0B] font-bold px-4 py-2 rounded-full text-lg">
              {t('xp_gained', { xp: result.xp_gained })} 🌟
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="bg-hoverBg border border-borderColor rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-xl font-bold font-poppins text-foreground mb-1">{t('breakdown_title')}</h3>
              {biggestContributor && (
                <p className="text-sm font-semibold text-secondary mb-4">
                  {t('biggest_contributor', {
                    category: biggestContributor.name,
                    amount: biggestContributor.value.toFixed(2)
                  })}
                </p>
              )}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text-muted)" 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                      interval={0}
                    />
                    <YAxis 
                      stroke="var(--text-muted)" 
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                    />
                    <Tooltip 
                      formatter={(val) => [`${Number(val).toFixed(2)} kg CO₂e`, t('emissions')]}
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-color)', 
                        borderColor: 'var(--border-color)', 
                        borderRadius: '12px', 
                        color: 'var(--text-main)' 
                      }} 
                    />
                    <Bar dataKey="value" fill="var(--primary-accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {(tipsList.length > 0 || encouragement) && (
            <div className="text-left mt-8">
              <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">{t('solutions_title')}</h3>
              
              {encouragement && (
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex gap-3 items-center text-foreground font-semibold mb-4">
                  <span>{t(encouragement)}</span>
                </div>
              )}

              <div className="space-y-4">
                {tipsList.map((tip, idx) => (
                  <div key={idx} className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl flex gap-4 items-start">
                    <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-foreground">
                          {t(`breakdown_${tip.category}`)}
                        </span>
                        <span className="text-xs font-semibold text-muted">
                          {tip.category === 'food' 
                            ? t(`diet_${tip.user_value}`) 
                            : `${tip.user_value} ${t(tip.user_unit_key)}`}
                          {' • '}{tip.impact.toFixed(2)} kg CO₂e
                        </span>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t(tip.action1_key)}</p>
                          {tip.action1_saving != null && tip.action1_assumption_key && (
                            <span className="inline-block mt-1 text-xs font-bold bg-secondary/20 text-secondary px-2 py-0.5 rounded-md">
                              {t('save_co2_badge', { 
                                amount: tip.action1_saving.toFixed(2), 
                                assumption: t(tip.action1_assumption_key) 
                              })}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-foreground">{t(tip.action2_key)}</p>
                          {tip.action2_saving != null && tip.action2_assumption_key && (
                            <span className="inline-block mt-1 text-xs font-bold bg-secondary/20 text-secondary px-2 py-0.5 rounded-md">
                              {t('save_co2_badge', { 
                                amount: tip.action2_saving.toFixed(2), 
                                assumption: t(tip.action2_assumption_key) 
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => { setResult(null); setStep(1); }}
            className="mt-8 bg-hoverBg hover:bg-black/10 dark:hover:bg-white/20 border border-borderColor text-foreground px-6 py-3 rounded-xl font-bold transition"
          >
            Calculate Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="glass-panel rounded-3xl p-8">
        
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-muted font-semibold">{t('step_of', { current: step, total: 6 })}</span>
            <span className="text-secondary font-bold text-lg">{t(currentStepData.titleKey)}</span>
          </div>
          <div className="w-full bg-hoverBg rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(57,255,20,0.5)]" 
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="animate-fade-in-up flex flex-col items-center text-center py-8" key={step}>
          <div className="bg-hoverBg p-6 rounded-full mb-6 border border-borderColor">
            {currentStepData.icon}
          </div>
          
          <label className="text-2xl font-bold font-poppins mb-6 text-foreground">
            {currentStepData.label}
          </label>

          {currentStepData.isSelect ? (
            <div className="flex items-center justify-center gap-2 mb-4 w-full">
              <select
                name="food"
                value={formData.food}
                onChange={handleChange}
                className="w-3/4 max-w-md bg-background border border-borderColor rounded-xl px-4 py-3 text-lg font-bold text-center text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="vegan">{t('diet_vegan')}</option>
                <option value="vegetarian">{t('diet_vegetarian')}</option>
                <option value="fish">{t('diet_fish')}</option>
                <option value="low_meat">{t('diet_low_meat')}</option>
                <option value="medium_meat">{t('diet_medium_meat')}</option>
                <option value="high_meat">{t('diet_high_meat')}</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4 w-full">
              <input 
                type="number" 
                name={currentStepData.name}
                min="0"
                value={formData[currentStepData.name] || ''}
                onChange={handleChange}
                className="w-1/3 bg-background border border-borderColor rounded-xl px-4 py-3 text-2xl font-bold text-center text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="0"
              />
              <span className="unit-badge">{currentStepData.unit}</span>
            </div>
          )}

          <p className="text-muted flex items-center gap-2">
            {currentStepData.helper}
            {currentStepData.tooltip && (
              <span className="group relative cursor-help">
                <Info size={16} className="text-secondary" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-background border border-borderColor text-foreground text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {currentStepData.tooltip}
                </span>
              </span>
            )}
          </p>
        </div>

        <div className="flex justify-between mt-8">
          <button 
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${step === 1 ? 'opacity-50 cursor-not-allowed text-muted' : 'bg-hoverBg hover:bg-black/10 dark:hover:bg-white/20 text-foreground border border-borderColor'}`}
          >
            <ArrowLeft size={20} /> {t('back').replace('← ', '')}
          </button>

          {step < 6 ? (
            <button 
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-secondary text-white dark:text-background px-8 py-3 rounded-xl font-bold hover:bg-[#27ae60] transition shadow-lg"
            >
              {t('next').replace(' →', '')} <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white dark:text-background px-8 py-3 rounded-xl font-bold hover:bg-secondary transition shadow-[0_0_15px_rgba(57,255,20,0.4)]"
            >
              {loading ? t('calculating') : t('submit')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Calculator;
