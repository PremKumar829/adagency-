import React, { useState } from 'react';
import { Sparkles, Send, Phone, Copy, Check, Target, DollarSign, User, ArrowRight } from 'lucide-react';
import { Language, Currency, GoalMessageConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ClientGoalMessageBuilderProps {
  language: Language;
  currency: Currency;
  onGoalConfigChange?: (config: GoalMessageConfig) => void;
}

const POPULAR_GOALS = [
  { id: 'telegram', label: '🚀 Telegram Members & Channel Reach', defaultBudget: '$150 (₹13,000)' },
  { id: 'gambling', label: '🎰 Gambling & Casino Direct FTD Traffic', defaultBudget: '$400 (₹35,000)' },
  { id: 'crypto', label: '💎 Crypto Token & DexScreener Trending', defaultBudget: '$500 (₹43,000)' },
  { id: 'social', label: '🔥 Instagram Reels & Meta Viral Ads', defaultBudget: '$200 (₹17,000)' },
  { id: 'custom', label: '📱 Mobile App Installs & Lead Gen', defaultBudget: '$300 (₹26,000)' },
  { id: 'reseller', label: '🤝 Wholesale Reseller Partnership', defaultBudget: '$1,000+ (₹87,000+)' },
];

export const ClientGoalMessageBuilder: React.FC<ClientGoalMessageBuilderProps> = ({
  language,
  currency,
  onGoalConfigChange,
}) => {
  const t = TRANSLATIONS[language];

  const [clientName, setClientName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(POPULAR_GOALS[0].label);
  const [budget, setBudget] = useState(POPULAR_GOALS[0].defaultBudget);
  const [targetHandleOrUrl, setTargetHandleOrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate dynamic message
  const generatedText = `Hello Prime Ads Agency! My name is ${clientName.trim() || '[Your Name]'}.
🎯 Primary Goal: ${selectedGoal}
💰 Planned Budget: ${budget}
🔗 Target Channel/URL: ${targetHandleOrUrl.trim() || 'To be shared in chat'}

I would like to review available packages and begin campaign setup with guaranteed reach.`;

  const handleLaunchWhatsApp = () => {
    const encoded = encodeURIComponent(generatedText);
    window.open(`https://wa.me/917004166377?text=${encoded}`, '_blank');
    if (onGoalConfigChange) {
      onGoalConfigChange({
        clientName: clientName.trim(),
        selectedGoal,
        budget,
        targetHandleOrUrl: targetHandleOrUrl.trim(),
      });
    }
  };

  const handleLaunchTelegram = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open('https://t.me/PREMGUPTA2M', '_blank');
    if (onGoalConfigChange) {
      onGoalConfigChange({
        clientName: clientName.trim(),
        selectedGoal,
        budget,
        targetHandleOrUrl: targetHandleOrUrl.trim(),
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0C1222] via-slate-900 to-[#0A101C] border border-cyan-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative neon glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Goal-Based Message Generator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Fast-Track Your Custom Campaign Message
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your growth objective below to dynamically pre-fill your direct WhatsApp & Telegram requests.
          </p>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Name input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            Your Name / Brand
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Rahul / CryptoVance"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
          />
        </div>

        {/* Goal select */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Primary Campaign Goal
          </label>
          <select
            value={selectedGoal}
            onChange={(e) => {
              setSelectedGoal(e.target.value);
              const found = POPULAR_GOALS.find((g) => g.label === e.target.value);
              if (found) setBudget(found.defaultBudget);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm cursor-pointer"
          >
            {POPULAR_GOALS.map((goal) => (
              <option key={goal.id} value={goal.label}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            Estimated Budget Range
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $250 / ₹20,000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Target URL (Optional) */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
          Target Channel / Platform Link (Optional)
        </label>
        <input
          type="text"
          value={targetHandleOrUrl}
          onChange={(e) => setTargetHandleOrUrl(e.target.value)}
          placeholder="https://t.me/yourchannel or website URL"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
        />
      </div>

      {/* Live Crafted Message Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Live Formatted Message Preview
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
        <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
          {generatedText}
        </pre>
      </div>

      {/* Dynamic CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          onClick={handleLaunchWhatsApp}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-98"
        >
          <Phone className="w-4 h-4 text-slate-950" />
          <span>Launch WhatsApp with Goal</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleLaunchTelegram}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(14,165,233,0.35)] transition-all cursor-pointer active:scale-98"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span>Launch Telegram with Goal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-500 mt-3">
        Links open directly with your target parameters pre-filled for immediate response.
      </p>
    </div>
  );
};
