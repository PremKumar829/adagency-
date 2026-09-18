import React, { useState } from 'react';
import { 
  Calculator, 
  Clock, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CURRENCY_CONFIG, formatPrice } from '../utils/currency';

interface CampaignEstimatorProps {
  language: Language;
  currency: Currency;
  onCurrencyChange: (cur: Currency) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onBookEstimatedCampaign: (config: {
    category: string;
    volume: number;
    estimatedCostUsd: number;
    deliveryTime: string;
    bonusReach: number;
  }) => void;
}

interface CategoryConfig {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  baseCostPerThousand: number;
  speedMultiplier: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  telegram: {
    id: 'telegram',
    name: 'Telegram Members & Channel Growth',
    unit: 'Target Members',
    min: 2000,
    max: 100000,
    step: 1000,
    defaultVal: 10000,
    baseCostPerThousand: 9.5,
    speedMultiplier: '12 - 24 Hours',
  },
  gambling: {
    id: 'gambling',
    name: 'Gambling & Gaming FTD Traffic',
    unit: 'Targeted Clicks / Impressions',
    min: 10000,
    max: 1000000,
    step: 10000,
    defaultVal: 100000,
    baseCostPerThousand: 2.8,
    speedMultiplier: '24 - 48 Hours',
  },
  social: {
    id: 'social',
    name: 'Meta Ads & YouTube Views',
    unit: 'Verified Impressions / Reach',
    min: 20000,
    max: 500000,
    step: 10000,
    defaultVal: 100000,
    baseCostPerThousand: 1.6,
    speedMultiplier: '24 - 72 Hours',
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto & Web3 Trending Push',
    unit: 'Community Reach / Dex Traffic',
    min: 5000,
    max: 150000,
    step: 5000,
    defaultVal: 25000,
    baseCostPerThousand: 8.2,
    speedMultiplier: 'Instant 6 - 12 Hours',
  },
  custom: {
    id: 'custom',
    name: 'Mobile App Installs & Lead Gen',
    unit: 'Targeted Installs / Leads',
    min: 500,
    max: 20000,
    step: 250,
    defaultVal: 2500,
    baseCostPerThousand: 85,
    speedMultiplier: '2 - 5 Days',
  },
};

export const CampaignEstimator: React.FC<CampaignEstimatorProps> = ({
  language,
  currency,
  onCurrencyChange,
  selectedCategory,
  onSelectCategory,
  onBookEstimatedCampaign,
}) => {
  const currentCategory = CATEGORY_CONFIGS[selectedCategory] || CATEGORY_CONFIGS.telegram;
  const [volume, setVolume] = useState<number>(currentCategory.defaultVal);

  const t = TRANSLATIONS[language];

  // Calculate costs and bonus reach
  const estimatedCostUsd = Math.max(
    30,
    Math.round((volume / 1000) * currentCategory.baseCostPerThousand)
  );
  const bonusReach = Math.round(volume * 0.15); // 15% promotional bonus

  const handleCategorySwitch = (catId: string) => {
    onSelectCategory(catId);
    const conf = CATEGORY_CONFIGS[catId];
    if (conf) {
      setVolume(conf.defaultVal);
    }
  };

  const handleBookNow = () => {
    onBookEstimatedCampaign({
      category: currentCategory.name,
      volume,
      estimatedCostUsd,
      deliveryTime: currentCategory.speedMultiplier,
      bonusReach,
    });
  };

  return (
    <section id="estimator" className="py-16 sm:py-24 bg-[#090D17] border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.estimator.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.estimator.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.estimator.subtitle}
          </p>
        </motion.div>

        {/* Estimator Interactive Shell */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md smooth-card transform-gpu"
        >
          {/* Subtle neon glow in corner */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Top Controls: Category Selection & Currency Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t.estimator.selectService}
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.values(CATEGORY_CONFIGS).map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategorySwitch(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      currentCategory.id === cat.id
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {cat.name.split(' ')[0]} {cat.name.split(' ')[1] || ''}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Currency Selector */}
            <div className="shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Currency
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-white">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  aria-label="Currency selection"
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="INR" className="bg-[#0f172a]">{CURRENCY_CONFIG.INR.label}</option>
                  <option value="USD" className="bg-[#0f172a]">{CURRENCY_CONFIG.USD.label}</option>
                  <option value="USDT" className="bg-[#0f172a]">{CURRENCY_CONFIG.USDT.label}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slider for Target Volume */}
          <div className="mb-10 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-300">
                {t.estimator.volumeSlider}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
                  {volume.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase">
                  {currentCategory.unit}
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={currentCategory.min}
              max={currentCategory.max}
              step={currentCategory.step}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
              <span>Min: {currentCategory.min.toLocaleString()}</span>
              <span>Max: {currentCategory.max.toLocaleString()}</span>
            </div>
          </div>

          {/* Real-time Calculation Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            
            {/* Cost Block */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 smooth-card transform-gpu"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {t.estimator.estimatedCost}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                {formatPrice(estimatedCostUsd, currency)}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Transparent flat pricing, all-inclusive
              </span>
            </motion.div>

            {/* Bonus Reach Block */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 smooth-card transform-gpu"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Special Bonus
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                +{bonusReach.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                {t.estimator.bonusReach}
              </span>
            </motion.div>

            {/* Delivery Speed Block */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 smooth-card transform-gpu"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {t.estimator.estimatedDelivery}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-display">
                {currentCategory.speedMultiplier}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Starts in 15-30 mins after booking
              </span>
            </motion.div>

          </div>

          {/* Guarantee Pill & Book Now CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.estimator.guarantee}</span>
            </div>

            <motion.button
              id="estimator-book-now-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBookNow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] transition-shadow cursor-pointer"
            >
              <span>{t.estimator.bookThisPackage}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            {t.estimator.customRequirement}
          </p>

        </motion.div>

      </div>
    </section>
  );
};
