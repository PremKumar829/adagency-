import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Rocket, Coins } from 'lucide-react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CURRENCY_CONFIG } from '../utils/currency';

interface NavbarProps {
  language: Language;
  currency: Currency;
  onCurrencyChange: (cur: Currency) => void;
  onOpenLaunchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  currency,
  onCurrencyChange,
  onOpenLaunchModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navLinks = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.pricing, href: '#estimator' },
    { label: t.nav.caseStudies, href: '#case-studies' },
    { label: t.nav.reseller, href: '#reseller' },
    { label: t.nav.faq, href: '#faq' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo with Verified Badge */}
          <a
            href="#hero"
            id="brand-logo-link"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
              <div className="w-full h-full bg-[#090E17] rounded-[10.5px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 text-lg tracking-wider">
                  PA
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight font-display group-hover:text-emerald-300 transition-colors">
                  {t.brandName}
                </span>
                <span
                  title={t.verified}
                  className="inline-flex items-center justify-center text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full p-0.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Digital & Growth Scale
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-emerald-400 hover:after:shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions: Currency Switcher & Primary Launch CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Currency Switcher */}
            <div className="relative">
              <label htmlFor="currency-switcher-select" className="sr-only">Choose Currency</label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-inner">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  id="currency-switcher-select"
                  aria-label="Currency"
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                  className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="INR" className="bg-[#0f172a] text-slate-200">
                    {CURRENCY_CONFIG.INR.label}
                  </option>
                  <option value="USD" className="bg-[#0f172a] text-slate-200">
                    {CURRENCY_CONFIG.USD.label}
                  </option>
                  <option value="USDT" className="bg-[#0f172a] text-slate-200">
                    {CURRENCY_CONFIG.USDT.label}
                  </option>
                </select>
              </div>
            </div>

            {/* Launch Campaign Button */}
            <button
              id="nav-launch-campaign-btn"
              onClick={onOpenLaunchModal}
              className="relative group inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Rocket className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
              <span>{t.nav.launchCampaign}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080C14] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-900/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-medium">Currency:</span>
              <select
                id="mobile-currency-select"
                aria-label="Select currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                <option value="INR">{CURRENCY_CONFIG.INR.label}</option>
                <option value="USD">{CURRENCY_CONFIG.USD.label}</option>
                <option value="USDT">{CURRENCY_CONFIG.USDT.label}</option>
              </select>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLaunchModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-md hover:bg-emerald-400"
            >
              <Rocket className="w-4 h-4" />
              <span>{t.nav.launchCampaign}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
