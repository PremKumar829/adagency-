import React from 'react';
import { ArrowRight, MessageCircle, Send, Zap, ShieldCheck, Target, Flame, Users, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  onBookCampaign: () => void;
  onInstantSupport: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onBookCampaign,
  onInstantSupport,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-grid-pattern">
      {/* Background neon ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow / Agency Quality Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{t.hero.badge}</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-normal">INSTANT FULFILLMENT</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
            {language === 'en' ? (
              <>
                Scale Your Brand,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  Telegram Channels
                </span>{' '}
                & Platforms Fast
              </>
            ) : (
              <>
                अपने ब्रांड,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  टेलीग्राम चैनलों
                </span>{' '}
                और प्लेटफॉर्म्स को तेजी से बढ़ाएं
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            {t.hero.subheadline}
          </p>

          {/* Hero Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 pt-2 w-full sm:w-auto">
            <button
              id="hero-book-campaign-cta"
              onClick={onBookCampaign}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all duration-200 cursor-pointer active:scale-98"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-instant-support-cta"
              onClick={onInstantSupport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-emerald-500/50 text-white font-semibold text-base transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>{t.hero.ctaSecondary}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          {/* Direct channels rapid access pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
            <a
              href="https://t.me/PREMGUPTA2M"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-600/30 text-sky-400 hover:bg-sky-900/50 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Telegram: @PREMGUPTA2M</span>
            </a>

            <a
              href="https://wa.me/917004166377"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp: +91 7004166377</span>
            </a>
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
