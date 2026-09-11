import React, { useState } from 'react';
import { 
  Send, 
  Dices, 
  Share2, 
  Coins, 
  Rocket, 
  Check, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { Language, Currency, ServiceItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SERVICES_DATA } from '../data/servicesData';
import { formatPrice } from '../utils/currency';

interface ServicesGridProps {
  language: Language;
  currency: Currency;
  onBookService: (service: ServiceItem) => void;
  onConfigureInEstimator: (serviceId: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  language,
  currency,
  onBookService,
  onConfigureInEstimator,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const t = TRANSLATIONS[language];

  const filteredServices =
    activeTab === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeTab);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Send':
        return <Send className="w-6 h-6 text-sky-400" />;
      case 'Dices':
        return <Dices className="w-6 h-6 text-amber-400" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-purple-400" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-emerald-400" />;
      case 'Rocket':
      default:
        return <Rocket className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.services.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.services.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.all}
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.telegram}
          </button>
          <button
            onClick={() => setActiveTab('gambling')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'gambling'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.gambling}
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.social}
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'crypto'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.crypto}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {t.services.tags.custom}
          </button>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-xl relative group hover:-translate-y-1"
            >
              {/* Badge if present */}
              {service.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Flame className="w-3 h-3 text-emerald-400" />
                    {service.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 group-hover:border-emerald-500/30 transition-colors">
                  {getServiceIcon(service.icon)}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2.5 mb-6 pt-2 border-t border-slate-800/80">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Price & CTAs */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {t.services.startingFrom}
                    </span>
                    <span className="text-2xl font-extrabold text-white font-display">
                      {formatPrice(service.startingPriceUsd, currency)}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-md">
                    {service.metrics}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onConfigureInEstimator(service.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.services.learnMore}</span>
                  </button>

                  <button
                    onClick={() => onBookService(service)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    <span>{t.services.bookNow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
