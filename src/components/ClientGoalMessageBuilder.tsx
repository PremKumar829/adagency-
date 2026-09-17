import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Send, Phone, Copy, Check, Target, DollarSign, IndianRupee, Coins, User, ArrowRight } from 'lucide-react';
import { Language, Currency, GoalMessageConfig, AgencySettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { buildWhatsAppLink, buildTelegramLink } from '../utils/agencySettings';
import { formatPrice } from '../utils/currency';

interface ClientGoalMessageBuilderProps {
  language: Language;
  currency: Currency;
  onGoalConfigChange?: (config: GoalMessageConfig) => void;
  agencySettings?: AgencySettings;
}

interface BudgetTier {
  id: string;
  minUsd: number;
  maxUsd?: number;
  label: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  { id: 'starter', minUsd: 100, maxUsd: 300, label: 'Starter Kickoff' },
  { id: 'growth', minUsd: 300, maxUsd: 800, label: 'Growth Scaling' },
  { id: 'aggressive', minUsd: 800, maxUsd: 2500, label: 'Aggressive Dominance' },
  { id: 'enterprise', minUsd: 2500, label: 'Wholesale Enterprise VIP' },
];

function getBudgetTierLabel(tier: BudgetTier, currency: Currency): string {
  if (currency === 'INR') {
    if (!tier.maxUsd) {
      return `${formatPrice(tier.minUsd, 'INR')}+ (${tier.label})`;
    }
    return `${formatPrice(tier.minUsd, 'INR')} - ${formatPrice(tier.maxUsd, 'INR')} (${tier.label})`;
  } else if (currency === 'USDT') {
    if (!tier.maxUsd) {
      return `${tier.minUsd.toLocaleString()} ₮+ (${tier.label})`;
    }
    return `${tier.minUsd.toLocaleString()} - ${tier.maxUsd.toLocaleString()} ₮ (${tier.label})`;
  } else {
    if (!tier.maxUsd) {
      return `$${tier.minUsd.toLocaleString()}+ (${tier.label})`;
    }
    return `$${tier.minUsd.toLocaleString()} - $${tier.maxUsd.toLocaleString()} (${tier.label})`;
  }
}

const POPULAR_GOALS = [
  { id: 'telegram', label: '🚀 Telegram Members & Channel Reach', tierId: 'starter' },
  { id: 'gambling', label: '🎰 Gambling & Casino Direct FTD Traffic', tierId: 'growth' },
  { id: 'crypto', label: '💎 Crypto Token & DexScreener Trending', tierId: 'growth' },
  { id: 'social', label: '🔥 Instagram Reels & Meta Viral Ads', tierId: 'starter' },
  { id: 'custom', label: '📱 Mobile App Installs & Lead Gen', tierId: 'starter' },
  { id: 'reseller', label: '🤝 Wholesale Reseller Partnership', tierId: 'enterprise' },
];

export const ClientGoalMessageBuilder: React.FC<ClientGoalMessageBuilderProps> = ({
  language,
  currency,
  onGoalConfigChange,
  agencySettings,
}) => {
  const t = TRANSLATIONS[language];

  const [clientName, setClientName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(POPULAR_GOALS[0].label);
  const [selectedTierId, setSelectedTierId] = useState<string>('starter');
  const [targetHandleOrUrl, setTargetHandleOrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const brand = agencySettings?.brandName || 'Prime Ads Agency';
  const isTelegramOnly = agencySettings?.contactRoutingMode === 'telegram_only';
  const telegramHandle = agencySettings ? agencySettings.telegramHandle.replace('@', '') : 'PREMGUPTA2M';

  // Compute dynamic budget label based on current currency
  const currentBudget = useMemo(() => {
    const tier = BUDGET_TIERS.find((t) => t.id === selectedTierId) || BUDGET_TIERS[0];
    return getBudgetTierLabel(tier, currency);
  }, [selectedTierId, currency]);

  // Synchronize with external parent state whenever parameters update
  useEffect(() => {
    if (onGoalConfigChange) {
      onGoalConfigChange({
        clientName: clientName.trim(),
        selectedGoal,
        budget: currentBudget,
        targetHandleOrUrl: targetHandleOrUrl.trim(),
      });
    }
  }, [clientName, selectedGoal, currentBudget, targetHandleOrUrl, onGoalConfigChange]);

  // Generate dynamic message
  const generatedText = `Hello ${brand}! My name is ${clientName.trim() || '[Your Name]'}.
🎯 Primary Goal: ${selectedGoal}
💰 Planned Budget: ${currentBudget}
🔗 Target Channel/URL: ${targetHandleOrUrl.trim() || 'To be shared in chat'}

I would like to review available packages and begin campaign setup with guaranteed reach.`;

  const handleLaunchWhatsApp = () => {
    if (agencySettings) {
      window.open(buildWhatsAppLink(agencySettings, generatedText), '_blank');
    } else {
      const encoded = encodeURIComponent(generatedText);
      window.open(`https://wa.me/917004166377?text=${encoded}`, '_blank');
    }
    if (onGoalConfigChange) {
      onGoalConfigChange({
        clientName: clientName.trim(),
        selectedGoal,
        budget: currentBudget,
        targetHandleOrUrl: targetHandleOrUrl.trim(),
      });
    }
  };

  const handleLaunchTelegram = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (agencySettings) {
      window.open(buildTelegramLink(agencySettings), '_blank');
    } else {
      window.open('https://t.me/PREMGUPTA2M', '_blank');
    }
    if (onGoalConfigChange) {
      onGoalConfigChange({
        clientName: clientName.trim(),
        selectedGoal,
        budget: currentBudget,
        targetHandleOrUrl: targetHandleOrUrl.trim(),
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoalChange = (newGoalLabel: string) => {
    setSelectedGoal(newGoalLabel);
    const matched = POPULAR_GOALS.find((g) => g.label === newGoalLabel);
    if (matched && matched.tierId) {
      setSelectedTierId(matched.tierId);
    }
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
            Configure your growth objective below to dynamically pre-fill your direct WhatsApp & Telegram requests in your preferred currency.
          </p>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Name input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Your Name / Brand
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., Alex / LuckyBet Casino"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Goal selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Target Growth Objective
          </label>
          <div className="relative">
            <Target className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedGoal}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs sm:text-sm truncate cursor-pointer"
            >
              {POPULAR_GOALS.map((g) => (
                <option key={g.id} value={g.label}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget select with dynamic currency support */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="target-budget-tier-select" className="text-xs font-semibold text-slate-300">
              Target Budget Tier
            </label>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {currency === 'INR' ? 'INR (₹)' : currency === 'USDT' ? 'USDT (₮)' : 'USD ($)'}
            </span>
          </div>
          <div className="relative">
            {currency === 'INR' ? (
              <IndianRupee className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            ) : currency === 'USDT' ? (
              <Coins className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            ) : (
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            )}
            <select
              id="target-budget-tier-select"
              aria-label="Target Budget Tier"
              value={selectedTierId}
              onChange={(e) => setSelectedTierId(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none text-slate-200 text-xs sm:text-sm cursor-pointer"
            >
              {BUDGET_TIERS.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {getBudgetTierLabel(tier, currency)}
                </option>
              ))}
            </select>
          </div>
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
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
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
      {isTelegramOnly ? (
        <div className="space-y-2">
          <button
            onClick={handleLaunchTelegram}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Launch Telegram with Pre-Filled Goal (@{telegramHandle})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[11px] text-sky-400 font-medium">
            ⚡ Direct telegram dispatch with message pre-copied to clipboard for 2-minute kickoff
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={handleLaunchTelegram}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(14,165,233,0.35)] transition-all cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Launch Telegram with Goal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchWhatsApp}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-98"
          >
            <Phone className="w-4 h-4 text-slate-950" />
            <span>Launch WhatsApp with Goal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-slate-500 mt-3">
        Links open directly with your target parameters pre-filled for immediate response.
      </p>
    </div>
  );
};
