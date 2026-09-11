import React from 'react';
import { 
  ShieldCheck, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  ArrowUp, 
  ExternalLink,
  Coins,
  CreditCard,
  QrCode
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenAdmin }) => {
  const t = TRANSLATIONS[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                {t.brandName}
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
                href="https://t.me/PREMGUPTA2M"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 hover:border-sky-500 transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917004166377"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 hover:border-emerald-500 transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:pk4030794@gmail.com"
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
                <a href="#reseller" className="hover:text-emerald-400 transition-colors">
                  {t.nav.reseller}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Key Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.services}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400 hover:text-white">
                Telegram Member Boosts
              </li>
              <li className="text-slate-400 hover:text-white">
                Gambling & Casino Traffic
              </li>
              <li className="text-slate-400 hover:text-white">
                Meta Ads & YouTube Push
              </li>
              <li className="text-slate-400 hover:text-white">
                DexScreener Trending
              </li>
              <li className="text-slate-400 hover:text-white">
                Mobile App Direct Installs
              </li>
              <li className="text-slate-400 hover:text-white">
                Wholesale Reseller API
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
                <a href="https://t.me/PREMGUPTA2M" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-sky-400">
                  t.me/PREMGUPTA2M
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/917004166377" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-emerald-400">
                  +91 7004166377
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <a href="mailto:pk4030794@gmail.com" className="text-slate-300 hover:text-rose-400">
                  pk4030794@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Katihar, Bihar - 854101
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
              <Coins className="w-3.5 h-3.5 text-teal-400" />
              USDT (TRC20 / ERC20)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Bitcoin (BTC)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              Cards & NetBanking
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Escrow Protection
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-6 text-[11px] text-slate-500 leading-relaxed">
          {t.footer.disclaimer}
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prime Ads Agency. {t.footer.rights}</p>

          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                title="Staff Portal Login"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
