import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FAQ_DATA } from '../data/faqData';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const faqs = FAQ_DATA[language];

  // Open first item by default
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#080C14] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900 border-emerald-500/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-display pr-4">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra Help Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
          Have a unique campaign inquiry or special custom whitelist requirement?{' '}
          <a
            href="https://t.me/PREMGUPTA2M"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 font-semibold underline hover:text-emerald-300"
          >
            Chat with our Telegram Lead Desk
          </a>
        </div>

      </div>
    </section>
  );
};
