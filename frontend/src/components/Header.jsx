import React, { useState } from 'react';
import { Search, ShieldCheck, Bell, Moon, Sun, Activity } from 'lucide-react';

const Header = ({ onOpenCommandPalette, theme, toggleTheme }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-industrial-900 border-b border-industrial-800 flex items-center justify-between px-6 z-40 relative transition-colors duration-500">
      
      {/* Left Area: Context / Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white tracking-tight">AI Product Intelligence</h1>
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-industrial-success/10 border border-industrial-success/20">
          <ShieldCheck className="w-3.5 h-3.5 text-industrial-success" />
          <span className="text-[10px] font-black uppercase tracking-wider text-industrial-success">Zero-Hallucination</span>
        </div>
      </div>
      
      {/* Center Area: Expanding Command Bar */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md hidden md:block">
        <div 
          onClick={onOpenCommandPalette}
          className="relative flex items-center bg-industrial-800 border border-industrial-700 hover:border-industrial-accent hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:scale-[1.02] rounded-lg transition-all duration-300 ease-out cursor-pointer"
        >
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <div className="w-full bg-transparent border-none outline-none text-sm text-slate-400 py-2.5 pl-10 pr-12">
            Search commands, parts, or press Ctrl+K...
          </div>
          <div className="absolute right-3 flex items-center gap-1 opacity-50">
            <kbd className="px-1.5 py-0.5 bg-industrial-900 border border-industrial-700 rounded text-[10px] text-white font-mono">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 bg-industrial-900 border border-industrial-700 rounded text-[10px] text-white font-mono">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-4 relative">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-industrial-800 rounded-full transition-colors text-slate-400 hover:text-white"
          title="Toggle Light/Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 hover:bg-industrial-800 rounded-full transition-colors text-slate-400 hover:text-white group"
        >
          <Bell className="w-5 h-5 group-hover:animate-pulse" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-industrial-accent rounded-full shadow-[0_0_5px_#38BDF8]"></span>
        </button>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-industrial-800 border border-industrial-700 shadow-2xl rounded-xl overflow-hidden animate-fade-in z-50">
            <div className="p-3 border-b border-industrial-700 bg-industrial-900/50 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Notifications</span>
              <span className="text-[10px] px-2 py-0.5 bg-industrial-accent/20 text-industrial-accent rounded-full font-bold">2 New</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-industrial-700/50 hover:bg-industrial-700/30 transition-colors cursor-pointer flex gap-3">
                <div className="mt-0.5 p-1.5 bg-industrial-success/20 rounded-full shrink-0">
                  <Activity className="w-4 h-4 text-industrial-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">AI Engine Connected</p>
                  <p className="text-xs text-slate-400">FastAPI backend is ready.</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Just now</p>
                </div>
              </div>
              <div className="p-3 hover:bg-industrial-700/30 transition-colors cursor-pointer flex gap-3">
                <div className="mt-0.5 p-1.5 bg-industrial-accent/20 rounded-full shrink-0">
                  <ShieldCheck className="w-4 h-4 text-industrial-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">System Boot Successful</p>
                  <p className="text-xs text-slate-400">All neural networks initialized.</p>
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
