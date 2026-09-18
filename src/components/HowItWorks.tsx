import React from 'react';
import { Layers, Send, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HowItWorksProps {
  language: Language;
  onStartCampaign: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  language,
  onStartCampaign,
}) => {
  const t = TRANSLATIONS[language];

  const steps = [
    {
      number: '01',
      icon: Layers,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      tag: 'Step 1: Configuration',
    },
    {
      number: '02',
      icon: Send,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      tag: 'Step 2: Rapid Routing',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      tag: 'Step 3: Viral Scaling',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#0A0E18] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* 3 Step Cards with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors duration-300 shadow-xl flex flex-col justify-between group smooth-card transform-gpu"
              >
                {/* Step indicator watermark */}
                <div className="absolute top-4 right-6 text-4xl font-extrabold text-slate-800/60 font-display select-none group-hover:text-emerald-500/15 transition-colors">
                  {step.number}
                </div>

                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center mb-6 shadow-inner group-hover:border-emerald-500/50 transition-colors">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-2">
                    {step.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 font-display">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center text-xs text-slate-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  <span>Guaranteed SLA Under 30 Mins</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Launch CTA Bar below steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartCampaign}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-shadow cursor-pointer"
          >
            <span>Start Your 3-Step Campaign Now</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};
