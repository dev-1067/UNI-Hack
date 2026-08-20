import React, { useState } from 'react';
import { RefreshCw, Bell, Sun, Moon, Activity } from 'lucide-react';

const Header = ({ activeView, theme, toggleTheme }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const viewTitles = {
    overview:    'AI Pipeline Overview',
    'sku-matrix':'SKU Processing Grid',
    heatmap:     'GIS Source Heatmap',
    analytics:   'Deep Analytics & ML',
    reports:     'Reports',
    settings:    'Settings',
    help:        'Help & Docs',
    catalogs:    'Parts Extraction Workspace',
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <header className="h-14 bg-cmd-900 border-b border-white/5 flex items-center justify-between px-5 z-40 relative shrink-0">

      {/* Left: Title */}
      <div className="flex items-center gap-3 w-1/4">
        <h2 className="text-[15px] font-bold text-white tracking-tight">
          {viewTitles[activeView] ?? 'Dashboard'}
        </h2>
      </div>

      {/* Center: Live Batch Progress */}
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="flex items-center gap-4 bg-cmd-800/50 border border-white/5 rounded-full px-4 py-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Processing</span>
          <div className="w-48 h-1.5 bg-cmd-900 rounded-full overflow-hidden">
            <div className="h-full bg-accent-cyan rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.6)]" style={{ width: '74.2%' }} />
          </div>
          <span className="text-[11px] font-bold text-accent-cyan">742 / 1000 <span className="text-slate-500 font-normal">Enriched</span></span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 relative">

        {/* Sync */}
        <button
          onClick={handleSync}
          title="Sync with backend"
          className="p-2 hover:bg-white/5 rounded-sm text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
        </button>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 hover:bg-white/5 rounded-sm text-slate-400 hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 hover:bg-white/5 rounded-sm text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-cyan rounded-full animate-live-dot" />
        </button>

        {/* DHO-style status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-status-online/10 border border-status-online/30 rounded-sm ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-live-dot" />
          <span className="text-[11px] font-bold text-status-online tracking-wide">DHO ONLINE</span>
        </div>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-cmd-800 border border-white/10 shadow-2xl rounded-sm overflow-hidden animate-modal-pop z-50">
            <div className="p-3 border-b border-white/5 bg-cmd-900/60 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Notifications</span>
              <span className="text-[10px] px-2 py-0.5 bg-accent-cyan/15 text-accent-cyan rounded-full font-bold">2 New</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                <div className="mt-0.5 p-1.5 bg-status-low/15 rounded-full shrink-0">
                  <Activity className="w-3.5 h-3.5 text-status-low" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">AI Engine Connected</p>
                  <p className="text-xs text-slate-400">FastAPI backend is ready.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Just now</p>
                </div>
              </div>
              <div className="p-3 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                <div className="mt-0.5 p-1.5 bg-accent-cyan/10 rounded-full shrink-0">
                  <Bell className="w-3.5 h-3.5 text-accent-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">3 SKUs flagged for review</p>
                  <p className="text-xs text-slate-400">Low confidence scores detected.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">2 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
