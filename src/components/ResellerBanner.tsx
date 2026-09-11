import React from 'react';
import { Briefcase, CheckCircle, ArrowRight, ShieldCheck, Zap, Send } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ResellerBannerProps {
  language: Language;
  onApplyReseller: () => void;
}

export const ResellerBanner: React.FC<ResellerBannerProps> = ({
  language,
  onApplyReseller,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="reseller" className="py-16 sm:py-20 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0D1524] to-slate-900 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Neon background effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.reseller.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
                {t.reseller.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {t.reseller.subtitle}
              </p>

              {/* 4 Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{t.reseller.perk1}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-medium">{t.reseller.perk2}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{t.reseller.perk3}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">{t.reseller.perk4}</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left w-full sm:w-auto">
                <span className="text-[11px] text-slate-400 font-mono uppercase block">
                  Wholesale Volume Tiers
                </span>
                <span className="text-lg font-bold text-white font-display">
                  $500+ / ₹40,000+ Monthly
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  Instant Wholesale Tier Activation
                </span>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto">
                <button
                  id="reseller-apply-btn"
                  onClick={onApplyReseller}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                >
                  <span>{t.reseller.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://t.me/PREMGUPTA2M"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500 text-sky-300 text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Direct Partner Telegram</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
