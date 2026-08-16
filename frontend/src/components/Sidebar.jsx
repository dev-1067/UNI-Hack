import React, { useState } from 'react';
import { Home, FolderGit2, Settings, HelpCircle, User, Cpu, LogOut, ChevronUp } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'catalogs', icon: FolderGit2, label: 'Catalogs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Docs' },
  ];

  return (
    <aside className="w-16 hover:w-64 flex flex-col h-screen bg-industrial-900 border-r border-industrial-800 transition-all duration-300 group z-50 overflow-visible shrink-0 absolute md:relative">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-industrial-800">
        <div className="p-2 bg-industrial-accent/20 rounded-lg shrink-0 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
          <Cpu className="text-industrial-accent w-6 h-6" />
        </div>
        <div className="ml-4 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 delay-100">
          <h1 className="text-sm font-bold text-white tracking-wide">AI Core</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2 overflow-hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              flex items-center px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
              ${activeView === item.id 
                ? 'bg-industrial-800 text-industrial-accent shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-industrial-800/50'}
            `}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? 'animate-pulse-glow rounded-full' : ''}`} />
            <span className="ml-4 font-semibold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* User Profile with Dropdown */}
      <div className="p-3 border-t border-industrial-800 relative">
        
        {/* Profile Menu Dropdown */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-56 bg-industrial-800 border border-industrial-700 shadow-2xl rounded-xl overflow-hidden animate-fade-in z-50">
            <div className="p-3 border-b border-industrial-700 bg-industrial-900/50">
              <p className="text-sm font-bold text-white">Devaansh</p>
              <p className="text-xs text-slate-400">devaansh@unihack.ai</p>
            </div>
            <div className="p-1.5">
              <button onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-industrial-700 rounded-lg flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button onClick={() => { setActiveView('help'); setIsProfileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-industrial-700 rounded-lg flex items-center gap-2 transition-colors">
                <HelpCircle className="w-4 h-4" /> FAQ & Support
              </button>
              <div className="h-px bg-industrial-700 my-1 mx-2"></div>
              <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-industrial-danger hover:bg-industrial-danger/10 rounded-lg flex items-center gap-2 transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        )}

        {/* Profile Button */}
        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-industrial-800 text-slate-400 hover:text-white w-full transition-colors"
        >
          <div className="flex items-center overflow-hidden">
            <div className="bg-slate-700 p-1.5 rounded-full shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3 text-left opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
              <p className="text-sm font-bold text-white">Devaansh</p>
              <p className="text-[10px] text-industrial-accent uppercase tracking-wider">Admin</p>
            </div>
          </div>
          <ChevronUp className={`w-4 h-4 opacity-0 group-hover:opacity-100 shrink-0 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
