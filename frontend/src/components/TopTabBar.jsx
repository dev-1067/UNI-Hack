import React, { useState, useRef } from 'react';
import { Zap, Grid3x3, Radio, BookOpen, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const tabs = [
  { id: 'overview',    label: 'AI Pipeline Overview',       icon: Zap },
  { id: 'sku-matrix',  label: 'SKU Processing Grid',        icon: Grid3x3 },
  { id: 'heatmap',     label: 'Source Web Radar',           icon: Radio },
  { id: 'analytics',   label: 'Deep Analytics & ML',        icon: BookOpen },
];

const TopTabBar = ({ activeView, setActiveView }) => {
  const scrollRef = useRef(null);
  const [lang, setLang] = useState('EN');
  const langs = ['EN', 'MR', 'HI'];

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-12 bg-cmd-850 border-b border-white/5 flex items-stretch shrink-0 relative z-30">

      {/* Scroll left */}
      <button onClick={() => scroll(-1)}
        className="px-2 text-slate-500 hover:text-white transition-colors shrink-0 hover:bg-white/5">
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable tabs */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-stretch overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {tabs.map((tab) => {
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`
                flex items-center gap-2 px-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all duration-200 shrink-0
                ${active
                  ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}

        {/* Syncing indicator */}
        <div className="flex items-center gap-2 px-4 text-[13px] font-semibold text-status-moderate border-b-2 border-transparent whitespace-nowrap shrink-0">
          <span className="w-2 h-2 rounded-full bg-status-moderate animate-live-dot" />
          Syncing DB...
        </div>
      </div>

      {/* Scroll right */}
      <button onClick={() => scroll(1)}
        className="px-2 text-slate-500 hover:text-white transition-colors shrink-0 hover:bg-white/5">
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Separator */}
      <div className="w-px bg-white/5 my-2" />

      {/* Guided Tour */}
      <button
        onClick={() => setActiveView('help')}
        className="flex items-center gap-2 px-4 text-[12px] font-bold text-white bg-status-critical/80 hover:bg-status-critical transition-colors shrink-0"
      >
        <Zap className="w-3.5 h-3.5" />
        Guided Tour
      </button>

      {/* Language Switcher */}
      <div className="flex items-stretch border-l border-white/5 shrink-0">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`
              px-3 text-[12px] font-bold transition-colors
              ${lang === l
                ? 'text-white bg-white/8'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
            `}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Medical Guidelines RAG equivalent */}
      <div className="flex items-stretch border-l border-white/5 shrink-0">
        <button
          onClick={() => setActiveView('reports')}
          className="flex items-center gap-2 px-4 text-[12px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5" />
          AI Guidelines RAG
        </button>
      </div>
    </div>
  );
};

export default TopTabBar;
