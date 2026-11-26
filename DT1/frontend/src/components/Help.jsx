import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, HelpCircle, Send } from 'lucide-react';

const Help = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:nainasaini838@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="glass-panel p-8 rounded-3xl shadow-2xl text-center border border-borderColor">
        <HelpCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h2 className="text-3xl font-bold font-poppins text-foreground mb-2">{t('help_title')}</h2>
        <p className="text-muted mb-8">{t('help_subtitle', 'We are here to assist you. Send us your queries directly!')}</p>

        <form onSubmit={handleSend} className="space-y-4 text-left">
          <div>
            <label className="block text-muted font-medium mb-1">{t('help_subject', 'Subject')}</label>
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('help_subject_placeholder', 'E.g., App is not calculating correctly')}
              className="w-full bg-background border border-borderColor text-foreground placeholder-muted rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none transition"
            />
          </div>
          <div>
            <label className="block text-muted font-medium mb-1">{t('help_message', 'Message')}</label>
            <textarea
              required
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('help_message_placeholder', 'Describe your issue or query here...')}
              className="w-full bg-background border border-borderColor text-foreground placeholder-muted rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none resize-none transition"
            ></textarea>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white dark:text-background font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(57,255,20,0.3)] mt-4">
            <Send size={20} /> {t('help_send', 'Send Email')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-borderColor text-muted text-sm">
          {t('help_reach_us', 'Or reach us directly at ')} <a href="mailto:nainasaini838@gmail.com" className="text-primary font-bold hover:underline">nainasaini838@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default Help;
