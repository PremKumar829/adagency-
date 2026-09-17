import React, { useState, useEffect } from 'react';
import { X, Rocket, Send, Phone, ShieldCheck, Check, Sparkles, Zap } from 'lucide-react';
import { Language, Currency, AgencySettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice } from '../utils/currency';
import { buildWhatsAppLink, buildTelegramLink, getEffectiveWhatsappNumber } from '../utils/agencySettings';

interface LaunchCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  prefillData?: {
    category?: string;
    volume?: number;
    estimatedCostUsd?: number;
    deliveryTime?: string;
  } | null;
  agencySettings?: AgencySettings;
}

export const LaunchCampaignModal: React.FC<LaunchCampaignModalProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  prefillData,
  agencySettings,
}) => {
  const t = TRANSLATIONS[language];

  const [category, setCategory] = useState('Telegram Channel & Group Growth');
  const [targetUrl, setTargetUrl] = useState('');
  const [clientHandle, setClientHandle] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedCostUsd, setEstimatedCostUsd] = useState(85);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (prefillData) {
      if (prefillData.category) setCategory(prefillData.category);
      if (prefillData.estimatedCostUsd) setEstimatedCostUsd(prefillData.estimatedCostUsd);
    }
  }, [prefillData]);

  if (!isOpen) return null;

  const isTelegramOnly = agencySettings?.contactRoutingMode === 'telegram_only';
  const effectiveWhatsapp = agencySettings ? getEffectiveWhatsappNumber(agencySettings) : '+91 7004166377';

  const handleLaunchWhatsApp = () => {
    const text = `*Urgent Campaign Launch - ${agencySettings?.brandName || 'Prime Ads Agency'}*%0A%0A*Service Category:* ${encodeURIComponent(category)}%0A*Target URL / Channel:* ${encodeURIComponent(targetUrl || 'To be shared in chat')}%0A*Client Contact:* ${encodeURIComponent(clientHandle || 'Client')}%0A*Estimated Budget:* ${encodeURIComponent(formatPrice(estimatedCostUsd, currency))}%0A*Notes:* ${encodeURIComponent(notes || 'Ready to start immediately')}`;
    if (agencySettings) {
      window.open(buildWhatsAppLink(agencySettings, text), '_blank');
    } else {
      window.open(`https://wa.me/917004166377?text=${text}`, '_blank');
    }
    setIsSuccess(true);
  };

  const handleLaunchTelegram = () => {
    if (agencySettings) {
      window.open(buildTelegramLink(agencySettings), '_blank');
    } else {
      window.open('https://t.me/PREMGUPTA2M', '_blank');
    }
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B101D] border border-emerald-500/40 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-2">
            <Rocket className="w-3.5 h-3.5" />
            <span>Instant Setup Available</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-display">
            Launch Your Campaign
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Setup initiated within 15-30 minutes with 24/7 dedicated support.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">
              Routing Configured!
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your campaign inquiry has been opened with our senior strategist desk.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Campaign Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="Telegram Channel & Group Growth">Telegram Channel & Group Growth</option>
                <option value="Gambling, Betting & Casino Ad Traffic">Gambling, Betting & Casino Ad Traffic</option>
                <option value="Meta, Google & YouTube High-Reach Push">Meta, Google & YouTube High-Reach Push</option>
                <option value="Crypto & Web3 Token Trending">Crypto & Web3 Token Trending</option>
                <option value="Custom App Installs & Lead Gen">Custom App Installs & Lead Gen</option>
              </select>
            </div>

            {/* Target URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Channel or Platform URL
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://t.me/yourchannel or website URL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Contact Handle */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Contact (Telegram Handle or WhatsApp)
              </label>
              <input
                type="text"
                value={clientHandle}
                onChange={(e) => setClientHandle(e.target.value)}
                placeholder="@username or phone number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Price Preview Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Estimated Package</span>
                <span className="text-lg font-bold text-emerald-400 font-display">
                  {formatPrice(estimatedCostUsd, currency)}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                Includes +15% Extra Reach
              </span>
            </div>

            {/* Action Buttons: 1-Click WhatsApp or Telegram */}
            <div className="pt-2">
              {isTelegramOnly ? (
                <div className="space-y-2">
                  <button
                    onClick={handleLaunchTelegram}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Launch Instantly via Telegram (@{agencySettings?.telegramHandle || 'PREMGUPTA2M'})</span>
                  </button>
                  <p className="text-center text-[10px] text-slate-400">
                    ⚡ Fastest routing: Connected to senior campaign desk in &lt; 2 mins
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleLaunchTelegram}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Launch via Telegram</span>
                  </button>

                  <button
                    onClick={handleLaunchWhatsApp}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Launch via WhatsApp</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>30-Day Anti-Drop Warranty Included</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
