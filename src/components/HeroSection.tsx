import React from 'react';
import { ArrowRight, MessageCircle, Send, Zap, ShieldCheck, Target, Flame, Users } from 'lucide-react';
import { motion } from 'motion/react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-grid-pattern">
      {/* Background neon ambient gradients with gentle floating animation */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.65, 0.4],
          x: ['-50%', '-48%', '-50%'],
          y: ['-50%', '-52%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 w-[550px] h-[320px] bg-emerald-500/15 blur-3xl pointer-events-none rounded-full transform-gpu will-change-transform"
      />
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.55, 0.35],
          y: [0, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 right-10 w-[380px] h-[280px] bg-cyan-500/15 blur-3xl pointer-events-none rounded-full transform-gpu will-change-transform"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Eyebrow / Agency Quality Badge with smooth shimmer */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)] shimmer-badge transform-gpu cursor-default"
          >
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold">Team PrimeX Verified</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-amber-300 font-bold">Unbeatable Pricing: CPC Under ₹2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-normal">24/7 Rapid Traffic</span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display"
          >
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
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl font-light leading-relaxed"
          >
            {agencySettings?.heroSubheadline || t.hero.subheadline}
          </motion.p>

          {/* CTAs Group with spring physics */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBookCampaign}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.65)] transition-shadow cursor-pointer"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onInstantSupport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-950/40 transition-colors cursor-pointer"
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
            </motion.button>
          </motion.div>

          {/* Direct channels rapid access pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
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
            </motion.a>

            {!isTelegramOnly ? (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp: {effectiveWhatsapp}</span>
              </motion.a>
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
          </motion.div>

          {/* Feature Trust Pills Grid with hover lift */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-3xl"
          >
            {[
              { icon: Zap, color: 'text-amber-400', label: t.hero.tag1 },
              { icon: ShieldCheck, color: 'text-emerald-400', label: t.hero.tag2 },
              { icon: Target, color: 'text-cyan-400', label: t.hero.tag3 },
              { icon: Users, color: 'text-teal-400', label: t.hero.tag4 },
            ].map((tag, idx) => {
              const TagIcon = tag.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 hover:border-slate-700 cursor-default"
                >
                  <TagIcon className={`w-4 h-4 ${tag.color} shrink-0`} />
                  <span className="font-medium">{tag.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
