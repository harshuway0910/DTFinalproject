import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Target } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const AuthModal = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    goal: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      if (res.data.success) {
        onLogin(res.data.user);
      } else {
        setError(res.data.message || t('auth_failed', 'Authentication failed'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('server_error', 'Server error'));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        email: 'google@user.com',
        google_signin: true
      });
      if (res.data.success) {
        onLogin(res.data.user);
      } else {
        setError(t('google_not_found', 'Google user not found. Please register.'));
      }
    } catch (err) {
      setError(t('google_signin_failed', 'Google Sign In failed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative animate-slide-up border border-borderColor shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground bg-hoverBg hover:bg-black/10 dark:hover:bg-white/20 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">{isLogin ? t('welcome_back', 'Welcome Back') : t('modal_title')}</h2>
          <p className="text-muted">{t('modal_subtitle', 'Start your journey to a greener future')}</p>
        </div>

        {error && <div className="mb-4 text-[#EF4444] text-sm text-center bg-[#EF4444]/10 py-2 rounded-lg border border-[#EF4444]/20">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-muted" size={20} />
                <input required name="name" onChange={handleChange} type="text" placeholder={t('name')} className="w-full bg-background border border-borderColor rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted transition" />
              </div>
              
              <div className="flex gap-4">
                <div className="relative w-1/3">
                  <input required name="age" onChange={handleChange} type="number" placeholder={t('age')} className="w-full bg-background border border-borderColor rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted transition" />
                </div>
                <div className="relative w-2/3">
                  <Target className="absolute left-3 top-3.5 text-muted" size={20} />
                  <input required name="goal" onChange={handleChange} type="number" placeholder={t('goal')} className="w-full bg-background border border-borderColor rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted transition" />
                </div>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-muted" size={20} />
            <input required name="email" onChange={handleChange} type="email" placeholder={t('email')} className="w-full bg-background border border-borderColor rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted transition" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-muted" size={20} />
            <input required name="password" onChange={handleChange} type="password" placeholder={t('password')} className="w-full bg-background border border-borderColor rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted transition" />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-secondary text-white dark:text-background font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all transform hover:-translate-y-0.5 mt-4">
            {isLogin ? t('login_button', 'Login') : t('register')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted">{isLogin ? t('no_account').split('?')[0] + '?' : t('already_account').split('?')[0] + '?'} </span>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
            {isLogin ? t('no_account').split('?')[1]?.trim() : t('already_account').split('?')[1]?.trim()}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <span className="h-px w-1/4 bg-borderColor"></span>
          <span className="text-sm text-muted">OR</span>
          <span className="h-px w-1/4 bg-borderColor"></span>
        </div>

        <button onClick={handleGoogleSignIn} type="button" className="w-full mt-6 bg-hoverBg border border-borderColor hover:bg-black/10 dark:hover:bg-white/10 text-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('google_signin')}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
