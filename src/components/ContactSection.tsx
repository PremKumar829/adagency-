import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Phone, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, Currency, ClientInquiry, GoalMessageConfig, AgencySettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ClientGoalMessageBuilder } from './ClientGoalMessageBuilder';
import { buildWhatsAppLink, buildTelegramLink, getEffectiveWhatsappNumber } from '../utils/agencySettings';

interface ContactSectionProps {
  language: Language;
  currency: Currency;
  initialCategory?: string;
  onInquirySubmitted?: (inquiry: ClientInquiry) => void;
  onGoalConfigChange?: (config: GoalMessageConfig) => void;
  agencySettings?: AgencySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  language,
  currency,
  initialCategory = 'Telegram Channel & Group Growth',
  onInquirySubmitted,
  onGoalConfigChange,
  agencySettings,
}) => {
  const t = TRANSLATIONS[language];

  const effectiveWhatsapp = agencySettings ? getEffectiveWhatsappNumber(agencySettings) : '+91 7004166377';
  const telegramHandle = agencySettings ? agencySettings.telegramHandle.replace('@', '') : 'PREMGUPTA2M';
  const telegramUrl = agencySettings ? buildTelegramLink(agencySettings) : 'https://t.me/PREMGUPTA2M';
  const emailAddr = agencySettings?.email || 'pk4030794@gmail.com';
  const phoneLine = agencySettings?.phone || '+91 7004166377';
  const addressText = agencySettings?.address || 'Katihar, Bihar - 854101';
  const isTelegramOnly = agencySettings?.contactRoutingMode === 'telegram_only';

  const getContactBudgetOptions = (cur: Currency) => {
    if (cur === 'INR') {
      return [
        { value: '₹4,000 - ₹13,000 (Starter Trial)', label: '₹4,000 - ₹13,000 (Starter Trial)' },
        { value: '₹13,000 - ₹45,000 (Medium Scale)', label: '₹13,000 - ₹45,000 (Medium Scale)' },
        { value: '₹45,000 - ₹1,30,000 (High-Impact Blitz)', label: '₹45,000 - ₹1,30,000 (High-Impact Blitz)' },
        { value: '₹1,30,000+ (Enterprise / Unlimited)', label: '₹1,30,000+ (Enterprise / Unlimited)' },
      ];
    } else if (cur === 'USDT') {
      return [
        { value: '50 - 150 ₮ (Starter Trial)', label: '50 - 150 ₮ (Starter Trial)' },
        { value: '150 - 500 ₮ (Medium Scale)', label: '150 - 500 ₮ (Medium Scale)' },
        { value: '500 - 1,500 ₮ (High-Impact Blitz)', label: '500 - 1,500 ₮ (High-Impact Blitz)' },
        { value: '1,500+ ₮ (Enterprise / Unlimited)', label: '1,500+ ₮ (Enterprise / Unlimited)' },
      ];
    } else {
      return [
        { value: '$50 - $150 (Starter Trial)', label: '$50 - $150 (Starter Trial)' },
        { value: '$150 - $500 (Medium Scale)', label: '$150 - $500 (Medium Scale)' },
        { value: '$500 - $1,500 (High-Impact Blitz)', label: '$500 - $1,500 (High-Impact Blitz)' },
        { value: '$1,500+ (Enterprise / Unlimited)', label: '$1,500+ (Enterprise / Unlimited)' },
      ];
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    category: initialCategory,
    budget: getContactBudgetOptions(currency)[1].value,
    message: '',
  });

  // Keep contact form budget synced with active currency
  useEffect(() => {
    const opts = getContactBudgetOptions(currency);
    setFormData((prev) => ({
      ...prev,
      budget: opts[1].value,
    }));
  }, [currency]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;

    setSubmitting(true);
    const newInquiry: ClientInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      category: formData.category,
      budget: formData.budget,
      message: formData.message.trim() || 'Standard campaign setup requested',
      timestamp: 'Just now',
      status: 'New',
    };

    // Persist to localStorage
    try {
      const stored = localStorage.getItem('prime_ads_inquiries');
      const list: ClientInquiry[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('prime_ads_inquiries', JSON.stringify([newInquiry, ...list]));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      if (onInquirySubmitted) {
        onInquirySubmitted(newInquiry);
      }
    }, 700);
  };

  const handleSendToWhatsApp = () => {
    const text = `*New Campaign Inquiry - ${agencySettings?.brandName || 'Prime Ads Agency'}*%0A%0A*Name:* ${encodeURIComponent(formData.name || 'Client')}%0A*Contact:* ${encodeURIComponent(formData.contact)}%0A*Category:* ${encodeURIComponent(formData.category)}%0A*Budget:* ${encodeURIComponent(formData.budget)}%0A*Target URL / Notes:* ${encodeURIComponent(formData.message || 'Ready to launch campaign')}`;
    if (agencySettings) {
      window.open(buildWhatsAppLink(agencySettings, text), '_blank');
    } else {
      window.open(`https://wa.me/917004166377?text=${text}`, '_blank');
    }
  };

  const handleSendToTelegram = () => {
    if (agencySettings) {
      window.open(buildTelegramLink(agencySettings), '_blank');
    } else {
      window.open('https://t.me/PREMGUPTA2M', '_blank');
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#090D16] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.contact.subtitle}
          </p>
        </motion.div>

        {/* Dynamic Client-Goal Message Generator Widget */}
        <ClientGoalMessageBuilder
          language={language}
          currency={currency}
          onGoalConfigChange={onGoalConfigChange}
          agencySettings={agencySettings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white font-display mb-4">
                {t.contact.orDirect}
              </h3>

              {/* Telegram Item */}
              <div className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                isTelegramOnly 
                  ? 'bg-sky-950/70 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                  : 'bg-slate-950/70 border-slate-800 hover:border-sky-500/50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-sky-400 font-bold uppercase block">
                        {t.contact.telegram}
                      </span>
                      {isTelegramOnly && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-300 text-[10px] font-mono font-bold">
                          ⚡ Preferred / 2-Min Reply
                        </span>
                      )}
                    </div>
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white hover:text-sky-300 transition-colors"
                    >
                      t.me/{telegramHandle}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(`t.me/${telegramHandle}`, 'telegram')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Handle"
                  >
                    {copiedKey === 'telegram' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 transition-colors cursor-pointer"
                    title="Open in Telegram"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Item */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase block">
                      {t.contact.whatsapp}
                    </span>
                    <a
                      href={agencySettings ? buildWhatsAppLink(agencySettings) : `https://wa.me/917004166377`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
                    >
                      {effectiveWhatsapp}
                    </a>
                    {isTelegramOnly && (
                      <span className="text-[10px] text-amber-400 block mt-0.5">
                        (WhatsApp currently offline for review - please use Telegram)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(effectiveWhatsapp, 'whatsapp')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedKey === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={agencySettings ? buildWhatsAppLink(agencySettings) : `https://wa.me/917004166377`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors cursor-pointer"
                    title="Open WhatsApp"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Gmail Item */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-rose-400 font-bold uppercase block">
                      {t.contact.email}
                    </span>
                    <a
                      href={`mailto:${emailAddr}`}
                      className="text-sm font-semibold text-white hover:text-rose-300 transition-colors"
                    >
                      {emailAddr}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(emailAddr, 'email')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`mailto:${emailAddr}`}
                    className="p-2 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 transition-colors cursor-pointer"
                    title="Send Email"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Physical Address Item */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold uppercase block">
                    {t.contact.address}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {addressText}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Regional Operations & Strategy Hub
                  </span>
                </div>
              </div>

            </div>

            {/* Instant Escalation Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                  Urgent Campaign Need?
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Telegram response avg: 2 minutes 24/7
                </p>
              </div>
              <a
                href="https://t.me/PREMGUPTA2M"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                Fast Track
              </a>
            </div>
          </motion.div>

          {/* Right: Interactive Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md smooth-card transform-gpu">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                {t.contact.formTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Receive customized conversion pricing and targeted reach blueprints within 30 minutes.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">
                    {t.contact.successMsg}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    To expedite your campaign kickoff immediately, choose your preferred communication channel below:
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleSendToWhatsApp}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Send to WhatsApp</span>
                    </button>
                    <button
                      onClick={handleSendToTelegram}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-sky-400 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Open in Telegram</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-slate-400 underline hover:text-white pt-2 block mx-auto"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Contact Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {t.contact.nameLabel} <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.contact.namePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {t.contact.contactLabel} <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder={t.contact.contactPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Category & Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        {t.contact.serviceLabel}
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm cursor-pointer"
                      >
                        <option value="Telegram Channel & Group Growth">Telegram Members & Group Promotion</option>
                        <option value="Gambling & Casino Ad Networks">Gambling, Casino & Betting Ads</option>
                        <option value="Meta Ads & YouTube Growth">Meta Ads, Reels & YouTube Growth</option>
                        <option value="Crypto & Web3 Trending Push">Crypto Token & DexScreener Trending</option>
                        <option value="Custom Brand & App Installs">Custom Brand Promotions & App Installs</option>
                        <option value="Agency Wholesale / Reseller">Agency Wholesale Reseller Access</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-budget-select" className="text-xs font-semibold text-slate-300">
                          {t.contact.budgetLabel}
                        </label>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {currency === 'INR' ? 'INR (₹)' : currency === 'USDT' ? 'USDT (₮)' : 'USD ($)'}
                        </span>
                      </div>
                      <select
                        id="contact-budget-select"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm cursor-pointer"
                      >
                        {getContactBudgetOptions(currency).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message / URL */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm resize-none"
                    />
                  </div>

                  {/* Submit CTA & Security notice */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span>{t.contact.submitting}</span>
                      ) : (
                        <>
                          <span>{t.contact.submitBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      100% Confidentiality NDA Protected
                    </span>
                    <span>No spam guarantee</span>
                  </div>
                </form>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
