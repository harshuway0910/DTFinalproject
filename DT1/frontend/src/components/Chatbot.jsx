import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm EcoBot 🌱 Powered by Gemini AI. Ask me anything about reducing your carbon footprint, eco-friendly habits, or sustainability!",
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "How to reduce travel emissions?",
    "Tips to save home electricity",
    "What is a carbon footprint?"
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text, isBot: false, time }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: text
      });

      setMessages(prev => [...prev, {
        text: res.data.bot_response,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Sorry, I couldn't reach the server right now. Please try again.";
      setMessages(prev => [...prev, {
        text: errorMsg,
        isBot: true,
        isError: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleClearChat = () => {
    setMessages([
      {
        text: "Chat cleared! How else can I assist you with your eco goals today? 🌱",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div 
          className="w-80 sm:w-96 rounded-3xl shadow-2xl mb-4 overflow-hidden flex flex-col animate-slide-up border border-borderColor bg-white/95 dark:bg-[#0D1F1A]/95 backdrop-blur-xl transition-colors duration-300"
          style={{ maxHeight: '560px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white dark:text-[#0D1F1A] p-4 flex justify-between items-center shadow-md transition-colors duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Bot size={20} className="text-white dark:text-[#0D1F1A]" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-1.5 text-sm leading-tight">
                  EcoBot
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/25 dark:bg-black/20 tracking-wide">
                    <Sparkles size={10} className="mr-0.5 inline" /> AI
                  </span>
                </h3>
                <p className="text-[11px] opacity-85 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 dark:bg-[#07d98f] animate-pulse"></span>
                  Gemini 3.8 Flash • Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat}
                title="Clear conversation"
                className="hover:bg-white/20 dark:hover:bg-black/20 text-white/80 hover:text-white dark:text-[#0D1F1A]/80 dark:hover:text-[#0D1F1A] p-1.5 rounded-full transition"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="hover:bg-white/20 dark:hover:bg-black/20 text-white/80 hover:text-white dark:text-[#0D1F1A]/80 dark:hover:text-[#0D1F1A] p-1.5 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/70 dark:bg-black/25 transition-colors duration-300" style={{ minHeight: '300px', maxHeight: '360px' }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex gap-2 max-w-[88%] ${m.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5 shadow-sm ${
                  m.isBot 
                    ? 'bg-primary/15 dark:bg-primary/25 text-primary' 
                    : 'bg-primary text-white dark:text-[#0D1F1A]'
                }`}>
                  {m.isBot ? <Bot size={15} /> : <User size={15} />}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col">
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-200 ${
                    m.isBot 
                      ? m.isError
                        ? 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-tl-none'
                        : 'bg-white dark:bg-white/[0.08] text-foreground border border-borderColor/60 dark:border-white/10 rounded-tl-none'
                      : 'bg-primary text-white dark:text-[#0D1F1A] font-medium rounded-tr-none shadow-primary/20'
                  }`}>
                    {m.text}
                  </div>
                  {m.time && (
                    <span className={`text-[10px] text-muted mt-1 px-1 ${m.isBot ? 'self-start' : 'self-end'}`}>
                      {m.time}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-2 self-start max-w-[85%]">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/15 dark:bg-primary/25 text-primary text-xs mt-0.5">
                  <Bot size={15} />
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-white/[0.08] border border-borderColor/60 dark:border-white/10 text-muted flex items-center gap-2 text-xs shadow-sm">
                  <Loader2 size={15} className="animate-spin text-primary" />
                  <span>EcoBot is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (visible when few messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 pt-2 pb-1 flex gap-1.5 flex-wrap bg-slate-50/70 dark:bg-black/25 border-t border-borderColor/40 transition-colors duration-300">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-[#0D1F1A] text-foreground border border-borderColor/70 dark:border-white/10 transition-all shadow-xs"
                >
                  🌱 {prompt}
                </button>
              ))}
            </div>
          )}
          
          {/* Input Form */}
          <form 
            onSubmit={handleSend} 
            className="p-3 border-t border-borderColor bg-white/95 dark:bg-[#0D1F1A]/90 backdrop-blur-md flex items-center gap-2 transition-colors duration-300"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask EcoBot about sustainability..." 
              disabled={isLoading}
              className="flex-grow bg-slate-100 dark:bg-white/[0.07] border border-borderColor/80 dark:border-white/10 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-foreground placeholder:text-muted/70 disabled:opacity-50 transition"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              title="Send message"
              className="bg-primary hover:bg-secondary text-white dark:text-[#0D1F1A] p-2.5 rounded-xl disabled:opacity-40 transition shadow-md shadow-primary/20 flex items-center justify-center flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          title="Chat with EcoBot"
          className="group relative bg-primary hover:bg-secondary text-white dark:text-[#0D1F1A] p-4 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 flex items-center justify-center"
        >
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Online green indicator badge */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 dark:bg-[#07d98f] rounded-full border-2 border-white dark:border-[#0D1F1A] animate-pulse"></span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
