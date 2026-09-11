import React from 'react';
import { 
  TrendingUp, 
  Users2, 
  Award, 
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones
} from 'lucide-react';
import { Language, Currency, LedgerOrder } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LiveLedgerTickerProps {
  language: Language;
  currency: Currency;
  onSelectOrderCategory?: (categoryName: string) => void;
  orders?: LedgerOrder[];
}

export const LiveLedgerTicker: React.FC<LiveLedgerTickerProps> = ({
  language,
}) => {
  const t = TRANSLATIONS[language];

  const trustBadges = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Anti-Drop Warranty',
      desc: 'All Telegram & Social campaigns backed by 30-day non-drop auto-refill guarantee.',
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
      title: 'Direct FTD & Real Traffic',
      desc: 'High-intent gambling players & crypto holders routed via real Telegram & push ad networks.',
    },
    {
      icon: <Lock className="w-4 h-4 text-teal-400" />,
      title: 'Zero Ban Risk Guarantee',
      desc: 'Gradual, organic delivery curves that strictly adhere to platform safety guidelines.',
    },
    {
      icon: <Headphones className="w-4 h-4 text-amber-400" />,
      title: 'Dedicated VIP Support',
      desc: 'Direct WhatsApp & Telegram account manager assigned to your campaign within 5 minutes.',
    },
  ];

  return (
    <section className="py-12 bg-[#0A0F1A] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Metric 1 */}
          <div className="relative p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <Users2 className="w-6 h-6 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                GLOBAL REACH
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {t.stats.clients}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.stats.clientsLabel}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="relative p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                QUALITY ASSURED
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {t.stats.successRate}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.stats.successRateLabel}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="relative p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-colors shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-teal-400" />
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                VERIFIED VOLUME
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {t.stats.reach}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.stats.reachLabel}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="relative p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                24/7 ONLINE
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {t.stats.support}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t.stats.supportLabel}
            </div>
          </div>
        </div>

        {/* Agency Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">{badge.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
