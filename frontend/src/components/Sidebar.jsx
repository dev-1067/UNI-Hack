import React, { useState } from 'react';
import {
  LayoutDashboard, Table2, Map, TrendingUp, FileText,
  Settings, HelpCircle, LogOut, ChevronUp, User,
  Cpu, Wifi, Database, Activity, Layers
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const pipelineNav = [
    {
      id: 'overview',
      icon: LayoutDashboard,
      label: 'Overview',
      sub: 'National Executive Summary',
    },
    {
      id: 'sku-matrix',
      icon: Table2,
      label: 'SKU Matrix',
      sub: 'Sortable Extraction Grid',
    },
    {
      id: 'review-queue',
      icon: Layers,
      label: 'Review Queue',
      sub: 'Human-in-the-Loop Validation',
    },
    {
      id: 'bulk-upload',
      icon: FileText,
      label: 'Bulk Upload',
      sub: 'OCR & VLM Document Ingestion',
    },

    {
      id: 'heatmap',
      icon: Map,
      label: 'Source Heatmap',
      sub: 'GIS Web Source Layers',
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      label: 'Deep Analytics & ML',
      sub: 'Multi-axis telemetry & AI projections',
    },
  ];

  const systemNav = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help',     icon: HelpCircle, label: 'Help & Docs' },
  ];

  return (
    <aside className="w-[185px] flex flex-col h-screen bg-cmd-900 border-r border-white/5 shrink-0 relative z-50">

      {/* ── Logo / Brand ── */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 gap-3">
        <div className="p-1.5 bg-accent-cyan/15 rounded-sm shadow-[0_0_12px_rgba(56,189,248,0.25)]">
          <Layers className="text-accent-cyan w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-wide leading-tight">Unilog AI</h1>
          <p className="text-[10px] text-accent-cyan font-semibold tracking-widest uppercase">Command Dashboard</p>
        </div>
      </div>

      {/* ── Tagline ── */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] italic text-slate-300 leading-snug">
          "One click, every spec."
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">एक क्लिक, हर स्पेक की जानकारी</p>
      </div>

      {/* ── PIPELINE section ── */}
      <div className="px-4 mt-4">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2">Pipeline</p>
      </div>
      <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto pb-2">
        {pipelineNav.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 cursor-pointer
                sidebar-item
                ${active
                  ? 'sidebar-item-active'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <item.icon className={`w-4 h-4 mt-0.5 shrink-0 ${active ? 'text-accent-cyan' : ''}`} />
              <div className="min-w-0">
                <p className={`text-[13px] font-semibold leading-tight ${active ? 'text-accent-cyan' : ''}`}>
                  {item.label}
                </p>
                {item.sub && (
                  <p className="text-[10px] text-slate-500 leading-snug mt-0.5 truncate">{item.sub}</p>
                )}
              </div>
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-white/5 my-3 mx-2" />

        {systemNav.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 cursor-pointer
                sidebar-item
                ${active
                  ? 'sidebar-item-active'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent-cyan' : ''}`} />
              <span className={`text-[13px] font-semibold ${active ? 'text-accent-cyan' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── ACTIVE OPERATOR ── */}
      <div className="border-t border-white/5 px-4 py-3">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2">Active Operator</p>

        {/* Profile Menu */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-[140px] left-3 right-3 bg-cmd-800 border border-white/10 shadow-2xl rounded-sm overflow-hidden animate-modal-pop z-50">
            <div className="p-3 border-b border-white/5 bg-cmd-900/60">
              <p className="text-sm font-bold text-white">Devaansh</p>
              <p className="text-xs text-slate-400">devaansh@unihack.ai</p>
            </div>
            <div className="p-1.5 space-y-0.5">
              <button onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-sm flex items-center gap-2 transition-colors">
                <Settings className="w-3.5 h-3.5" /> Account Settings
              </button>
              <button onClick={() => { setActiveView('help'); setIsProfileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-sm flex items-center gap-2 transition-colors">
                <HelpCircle className="w-3.5 h-3.5" /> Support
              </button>
              <div className="h-px bg-white/5 my-1 mx-2" />
              <button onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-sm flex items-center gap-2 transition-colors font-medium">
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center gap-2.5 w-full hover:bg-white/5 px-2 py-1.5 rounded-sm transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan/60 to-blue-600/60 flex items-center justify-center shrink-0 font-black text-white text-sm">
            D
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white truncate">Devaansh</p>
            <p className="text-[10px] text-accent-cyan uppercase tracking-wider font-semibold">Admin Operator</p>
          </div>
          <ChevronUp className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${isProfileMenuOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* ── SYSTEM INFRASTRUCTURE ── */}
      <div className="border-t border-white/5 px-4 py-3 space-y-1.5">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2">System Infrastructure</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">DL AI Engine</span>
          </div>
          <span className="text-[10px] font-bold text-status-online">ONLINE</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">FastAPI & DB</span>
          </div>
          <span className="text-[10px] font-bold text-accent-cyan">SYNCED</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">Web Grounding</span>
          </div>
          <span className="text-[10px] font-bold text-status-online">LIVE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
