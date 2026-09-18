import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp, 
  ExternalLink,
  Coins,
  CreditCard,
  QrCode,
  Lock
} from 'lucide-react';
import { Language, AgencySettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { buildWhatsAppLink, buildTelegramLink, getEffectiveWhatsappNumber } from '../utils/agencySettings';

interface FooterProps {
  language: Language;
  onOpenAdmin?: () => void;
  onOpenInvoice?: () => void;
  agencySettings?: AgencySettings;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenAdmin, onOpenInvoice, agencySettings }) => {
  const t = TRANSLATIONS[language];
  const [secretClickCount, setSecretClickCount] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = agencySettings?.brandName || t.brandName;
  const telegramUrl = agencySettings ? buildTelegramLink(agencySettings) : 'https://t.me/PREMGUPTA2M';
  const telegramHandle = agencySettings ? agencySettings.telegramHandle.replace('@', '') : 'PREMGUPTA2M';
  const effectiveWhatsapp = agencySettings ? getEffectiveWhatsappNumber(agencySettings) : '+91 7004166377';
  const whatsappUrl = agencySettings ? buildWhatsAppLink(agencySettings) : 'https://wa.me/917004166377';
  const emailAddr = agencySettings?.email || 'pk4030794@gmail.com';
  const addressText = agencySettings?.address || 'Katihar, Bihar - 854101';

  return (
    <footer className="bg-[#05080E] text-slate-400 border-t border-slate-800/90 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1.5px]">
                <div className="w-full h-full bg-[#090E17] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 text-sm">
                    PA
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-xl text-white font-display">
                {brandName}
              </span>
              <span className="text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 hover:border-sky-500 transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 hover:border-emerald-500 transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${emailAddr}`}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-400 hover:border-rose-500 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-emerald-400 transition-colors">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-emerald-400 transition-colors">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-emerald-400 transition-colors">
                  {t.nav.caseStudies}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  {t.nav.contact}
                </a>
              </li>
              {onOpenInvoice && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenInvoice}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download Invoice / Receipt</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Campaign Verticals
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400 hover:text-white cursor-pointer">
                Telegram Channel & Community Growth
              </li>
              <li className="text-slate-400 hover:text-white cursor-pointer">
                Gambling & Casino Traffic Networks
              </li>
              <li className="text-slate-400 hover:text-white cursor-pointer">
                Crypto Token & Web3 Trend Pushes
              </li>
              <li className="text-slate-400 hover:text-white cursor-pointer">
                Meta & YouTube Video Scaling
              </li>
              <li className="text-slate-400 hover:text-white cursor-pointer">
                High-Volume Agency Reseller API
              </li>
            </ul>
          </div>

          {/* Direct Address & Info */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href={telegramUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-sky-400">
                  t.me/{telegramHandle}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-emerald-400">
                  {effectiveWhatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <a href={`mailto:${emailAddr}`} className="text-slate-300 hover:text-rose-400">
                  {emailAddr}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  {addressText}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Secure Payment Trust Badges */}
        <div className="py-8 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{t.footer.paymentTrust}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              UPI / GPay / PhonePe
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              USDT (TRC20 / BEP20)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              Credit & Debit Cards
            </span>
          </div>
        </div>

        {/* Bottom copyright & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <span className="text-slate-700">•</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Admin Control Panel"
              >
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
