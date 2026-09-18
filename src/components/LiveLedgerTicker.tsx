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
import { motion } from 'motion/react';
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

  const metrics = [
    {
      icon: Users2,
      color: 'text-emerald-400',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/40',
      tag: 'GLOBAL REACH',
      val: t.stats.clients,
      label: t.stats.clientsLabel,
    },
    {
      icon: Award,
      color: 'text-cyan-400',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/40',
      tag: 'QUALITY ASSURED',
      val: t.stats.successRate,
      label: t.stats.successRateLabel,
    },
    {
      icon: TrendingUp,
      color: 'text-teal-400',
      tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      hoverBorder: 'hover:border-teal-500/40',
      tag: 'VERIFIED VOLUME',
      val: t.stats.reach,
      label: t.stats.reachLabel,
    },
    {
      icon: Zap,
      color: 'text-amber-400',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/40',
      tag: '24/7 ONLINE',
      val: t.stats.support,
      label: t.stats.supportLabel,
    },
  ];

  return (
    <section className="py-12 bg-[#0A0F1A] border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className={`relative p-5 rounded-xl bg-slate-900/90 border border-slate-800 ${m.hoverBorder} shadow-lg group smooth-card transform-gpu cursor-default`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${m.color}`} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${m.tagColor}`}>
                    {m.tag}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {m.val}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  {m.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Agency Guarantees Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80"
        >
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 smooth-card transform-gpu"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">{badge.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
