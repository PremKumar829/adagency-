import React from 'react';
import { TrendingUp, BarChart3, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';
import { Language, CaseStudy } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CASE_STUDIES_DATA } from '../data/caseStudiesData';

interface CaseStudiesProps {
  language: Language;
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({
  language,
  onSelectCaseStudy,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="case-studies" className="py-16 sm:py-24 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{t.caseStudies.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            {t.caseStudies.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {t.caseStudies.subtitle}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES_DATA.map((study) => {
            const maxPoint = Math.max(...study.chartPoints);

            return (
              <div
                key={study.id}
                id={`case-study-${study.id}`}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 shadow-xl group hover:-translate-y-1"
              >
                <div>
                  {/* Category & Duration Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wide bg-teal-950/50 border border-teal-800/40 px-2.5 py-1 rounded-md">
                      {study.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {study.duration}
                    </span>
                  </div>

                  {/* Title & Client Type */}
                  <h3 className="text-xl font-bold text-white mb-1 font-display group-hover:text-teal-300 transition-colors">
                    {study.title}
                  </h3>
                  <span className="text-xs text-slate-400 block mb-4">
                    {study.clientType}
                  </span>

                  {/* Mini Visual Growth Graph Bars */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
                    <div className="flex items-end justify-between h-24 gap-2 pt-2">
                      {study.chartPoints.map((val, idx) => {
                        const heightPct = Math.round((val / maxPoint) * 100);
                        const isLast = idx === study.chartPoints.length - 1;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-t-sm transition-all duration-500 ${
                                isLast
                                  ? 'bg-gradient-to-t from-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                                  : 'bg-slate-700/60 group-hover:bg-slate-600/70'
                              }`}
                            />
                            <span className="text-[9px] text-slate-500 font-mono">
                              D{idx + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Before & After Metrics Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {t.caseStudies.before}
                      </span>
                      <span className="text-sm font-bold text-slate-300 font-mono">
                        {study.beforeStat}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                        {t.caseStudies.after}
                      </span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">
                        {study.afterStat}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {study.description}
                  </p>
                </div>

                {/* Bottom ROI & Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-medium">
                      Performance Delta
                    </span>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-base font-extrabold text-emerald-400 font-display">
                        {study.growthPercentage}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCaseStudy(study)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                  >
                    <span>{study.roi}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
