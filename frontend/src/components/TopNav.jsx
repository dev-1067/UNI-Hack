import React, { useState } from 'react';
import {
  LayoutDashboard, Table2, Layers, FileText, Wifi,
  Map, TrendingUp, Settings, HelpCircle, LogOut, ChevronDown
} from 'lucide-react';

const TopNav = ({ activeView, setActiveView, onLogout, theme, toggleTheme }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mainNav = [
    { id: 'overview',     icon: LayoutDashboard, label: 'Overview' },
    { id: 'sku-matrix',   icon: Table2,          label: 'SKU Matrix' },
    { id: 'review-queue', icon: Layers,          label: 'Review Queue' },
    { id: 'bulk-upload',  icon: FileText,        label: 'Bulk Upload' },

    { id: 'heatmap',      icon: Map,             label: 'Heatmap' },
    { id: 'analytics',    icon: TrendingUp,      label: 'Analytics' },
  ];

  return (
    <nav className="h-14 w-full bg-cmd-900 border-b border-white/5 flex items-center justify-between px-4 shrink-0 relative z-50">
      
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 shrink-0 mr-8">
        <div className="p-1.5 bg-accent-cyan/15 rounded-sm border border-accent-cyan/30">
          <Layers className="text-accent-cyan w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-widest uppercase">Unilog AI</h1>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {mainNav.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all duration-200 text-sm font-bold whitespace-nowrap
                ${active
                  ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-4 shrink-0 ml-4 border-l border-white/5 pl-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        {/* Profile Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-sm transition-colors group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">Devaansh</p>
              <p className="text-[10px] text-accent-cyan uppercase tracking-wider">Admin</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-fuchsia flex items-center justify-center font-black text-white text-sm rounded-sm">
              D
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-cmd-800 border border-white/10 shadow-2xl rounded-sm overflow-hidden animate-fade-in z-50">
              <div className="p-1 space-y-0.5">
                <button onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-sm flex items-center gap-2 transition-colors">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </button>
                <button onClick={() => { setActiveView('help'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-sm flex items-center gap-2 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" /> Support
                </button>
                <div className="h-px bg-white/5 my-1 mx-1" />
                <button onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-sm text-status-critical hover:bg-status-critical/10 rounded-sm flex items-center gap-2 transition-colors font-bold">
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
