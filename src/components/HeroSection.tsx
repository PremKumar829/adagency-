import React from 'react';
import { ArrowRight, MessageCircle, Send, Zap, ShieldCheck, Target, Flame, Users, TrendingUp } from 'lucide-react';
import { Language, AgencySettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { buildWhatsAppLink, buildTelegramLink, getEffectiveWhatsappNumber } from '../utils/agencySettings';

interface HeroSectionProps {
  language: Language;
  onBookCampaign: () => void;
  onInstantSupport: () => void;
  agencySettings?: AgencySettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onBookCampaign,
  onInstantSupport,
  agencySettings,
}) => {
  const t = TRANSLATIONS[language];

  const telegramUrl = agencySettings ? buildTelegramLink(agencySettings) : 'https://t.me/PREMGUPTA2M';
  const telegramHandle = agencySettings?.telegramHandle || '@PREMGUPTA2M';
  const effectiveWhatsapp = agencySettings ? getEffectiveWhatsappNumber(agencySettings) : '+91 7004166377';
  const whatsappUrl = agencySettings ? buildWhatsAppLink(agencySettings) : 'https://wa.me/917004166377';
  const isTelegramOnly = agencySettings?.contactRoutingMode === 'telegram_only';

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-grid-pattern">
      {/* Background neon ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow / Agency Quality Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold">Team PrimeX Verified</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-amber-300 font-bold">Unbeatable Pricing: CPC Under ₹2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-normal">24/7 Rapid Traffic</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
            {agencySettings?.heroHeadline ? (
              <span>{agencySettings.heroHeadline}</span>
            ) : language === 'en' ? (
              <>
                Scale Telegram Growth,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  Gambling Ad Networks
                </span>{' '}
                & Brand Promotions
              </>
            ) : (
              <>
                टेलीग्राम ग्रोथ,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  गैम्बलिंग ऐड्स
                </span>{' '}
                और ब्रांड प्रमोशन को स्केल करें
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl font-light leading-relaxed">
            {agencySettings?.heroSubheadline || t.hero.subheadline}
          </p>

          {/* CTAs Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={onBookCampaign}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onInstantSupport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-950/40 transition-all cursor-pointer"
            >
              {isTelegramOnly ? (
                <>
                  <Send className="w-5 h-5 text-sky-400" />
                  <span>Instant Telegram Desk</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>{t.hero.ctaSecondary}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </>
              )}
            </button>
          </div>

          {/* Direct channels rapid access pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                isTelegramOnly
                  ? 'bg-sky-500/20 border border-sky-400 text-sky-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'bg-sky-950/40 border border-sky-600/30 text-sky-400 hover:bg-sky-900/50'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>Telegram: {telegramHandle} {isTelegramOnly ? '(2-Min Instant Reply)' : ''}</span>
            </a>

            {!isTelegramOnly ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp: {effectiveWhatsapp}</span>
              </a>
            ) : (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-600/30 text-amber-400 text-[11px]"
                title="WhatsApp update in progress, Telegram is 100% active"
              >
                <span>⚡ WhatsApp Updating → Use Telegram for 24/7 Desk</span>
              </a>
            )}
          </div>

          {/* Feature Trust Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-3xl">
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{t.hero.tag1}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{t.hero.tag2}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Target className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-medium">{t.hero.tag3}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Users className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-medium">{t.hero.tag4}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
