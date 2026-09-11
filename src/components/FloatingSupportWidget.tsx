import React, { useState } from 'react';
import { MessageCircle, Send, X, Phone, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Language, GoalMessageConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FloatingSupportWidgetProps {
  language: Language;
  clientGoalConfig?: GoalMessageConfig | null;
}

export const FloatingSupportWidget: React.FC<FloatingSupportWidgetProps> = ({
  language,
  clientGoalConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const getCustomMessage = () => {
    if (clientGoalConfig && (clientGoalConfig.clientName || clientGoalConfig.selectedGoal)) {
      return `Hi Prime Ads Agency! My name is ${clientGoalConfig.clientName || 'Client'}.
I need promotion for ${clientGoalConfig.selectedGoal || 'Telegram / Gambling Campaigns'} with a budget of ${clientGoalConfig.budget || 'standard'}.
Target Link: ${clientGoalConfig.targetHandleOrUrl || 'To be shared in chat'}.`;
    }
    return 'Hi Prime Ads Agency, I need urgent promotion for my Telegram channel / platform. What are your current packages?';
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(getCustomMessage());
    window.open(`https://wa.me/917004166377?text=${text}`, '_blank');
  };

  const handleTelegram = () => {
    const msg = getCustomMessage();
    navigator.clipboard.writeText(msg);
    window.open('https://t.me/PREMGUPTA2M', '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Support Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
                  PA
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {t.brandName} Desk
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{t.chat.agentOnline}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#0a0f1a]">
            {clientGoalConfig && (clientGoalConfig.clientName || clientGoalConfig.selectedGoal) ? (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3" />
                  Target Goal Synced: {clientGoalConfig.clientName || 'Client'}
                </span>
                <p className="text-slate-200 font-medium truncate">
                  {clientGoalConfig.selectedGoal}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">
                  👋 Hello! How can we accelerate your reach today?
                </p>
                <p className="text-slate-400 text-[11px]">
                  {t.chat.responseTime}. Select your preferred instant messaging platform:
                </p>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-white block font-bold">
                    {t.chat.whatsappText}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    +91 7004166377
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded font-mono">
                Launch with Goal
              </span>
            </button>

            {/* Telegram CTA */}
            <button
              onClick={handleTelegram}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 hover:border-sky-500 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Send className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-white block font-bold">
                    {t.chat.telegramText}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    @PREMGUPTA2M
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded font-mono">
                Instant Direct
              </span>
            </button>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-center text-slate-500">
            Pre-fills your client objective for prioritized queuing
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        id="floating-support-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-950 border border-white" />
        </div>
        <span className="hidden sm:inline">{t.chat.startChat}</span>
        
        {/* Subtle status pulse indicator */}
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
      </button>
    </div>
  );
};
