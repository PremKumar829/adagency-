import React from 'react';
import { Sparkles, Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AnnouncementBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  customAnnouncement?: string;
  isVisible?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  language,
  onLanguageChange,
  customAnnouncement,
  isVisible = true,
}) => {
  const t = TRANSLATIONS[language];

  if (!isVisible) return null;

  const displayText = customAnnouncement?.trim() || t.announcement;

  return (
    <aside
      id="top-announcement-bar"
      aria-label="Special promotion announcement"
      className="relative z-50 bg-gradient-to-r from-emerald-950 via-[#0a161f] to-emerald-950 border-b border-emerald-500/20 text-xs sm:text-sm text-slate-200 py-2 px-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Glowing Announcement text ticker */}
        <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE
          </span>
          <p className="font-medium text-slate-200 tracking-wide truncate">
            {displayText}
          </p>
        </div>

        {/* Action & Language Switcher Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative group">
            <label htmlFor="language-switcher-select" className="sr-only">Choose Language</label>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-medium text-slate-200 cursor-pointer transition-colors shadow-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                id="language-switcher-select"
                aria-label="Language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-[#0f172a] text-slate-200">
                  English (EN)
                </option>
                <option value="hi" className="bg-[#0f172a] text-slate-200">
                  हिन्दी (Hindi)
                </option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
