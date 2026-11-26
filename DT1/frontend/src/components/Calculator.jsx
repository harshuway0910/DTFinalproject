import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Car, ShoppingBag, Zap, Trash2, ArrowRight, ArrowLeft, Info, CheckCircle } from 'lucide-react';
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
    waste: 0
  });
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
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
      setTips(tipsRes.data.tips);
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

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const stepsData = [
    {
      id: 1,
      name: 'travel',
      label: t('travel_label'),
      icon: <Car size={32} className="text-secondary" />,
      unit: t('travel_unit'),
      helper: t('travel_helper')
    },
    {
      id: 2,
      name: 'shopping',
      label: t('shopping_label'),
      icon: <ShoppingBag size={32} className="text-secondary" />,
      unit: t('shopping_unit'),
      helper: t('shopping_helper')
    },
    {
      id: 3,
      name: 'electricity',
      label: t('electricity_label'),
      icon: <Zap size={32} className="text-secondary" />,
      unit: t('electricity_unit'),
      helper: t('electricity_helper'),
      tooltip: t('electricity_tooltip')
    },
    {
      id: 4,
      name: 'waste',
      label: t('waste_label'),
      icon: <Trash2 size={32} className="text-secondary" />,
      unit: t('waste_unit'),
      helper: t('waste_helper')
    }
  ];

  const currentStepData = stepsData[step - 1];

  if (result) {
    const isGood = result.total_footprint < 50;
    const isWarning = result.total_footprint >= 50 && result.total_footprint <= 150;
    const colorClass = isGood ? 'text-[#22C55E]' : isWarning ? 'text-[#F59E0B]' : 'text-[#EF4444]';

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

          {tips && tips.length > 0 && (
            <div className="text-left mt-8">
              <h3 className="text-2xl font-bold mb-4 font-poppins text-foreground">{t('solutions_title')}</h3>
              <div className="space-y-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl flex gap-4 items-start">
                    <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-semibold text-foreground">{tip}</p>
                      <span className="inline-block mt-2 text-xs font-bold bg-secondary/20 text-secondary px-2 py-1 rounded-md">Save CO₂</span>
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
            <span className="text-muted font-semibold">{t('step_of', { current: step, total: 4 })}</span>
            <span className="text-secondary font-bold text-lg capitalize">{currentStepData.name}</span>
          </div>
          <div className="w-full bg-hoverBg rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(57,255,20,0.5)]" 
              style={{ width: `${(step / 4) * 100}%` }}
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

          {step < 4 ? (
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
