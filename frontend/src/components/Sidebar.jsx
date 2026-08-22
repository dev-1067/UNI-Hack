import React, { useState } from 'react';
import { 
  LayoutDashboard, Box, FolderOpen, Shield, BrainCircuit, 
  Settings, HelpCircle, ChevronUp, User, Zap, Activity, FileText, LogOut
} from 'lucide-react';
import NexoraLogo from '../assets/nexora-logo.svg.png';

const Sidebar = ({ activeView, setActiveView, onLogout, isOpen, setIsOpen, mockUser }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'products', icon: Box, label: 'Products' },
    { id: 'catalog', icon: FolderOpen, label: 'Catalog' },
    { id: 'quality', icon: Shield, label: 'Data Quality' },
    { id: 'enrichment', icon: BrainCircuit, label: 'AI Enrichment' },
    { id: 'integrations', icon: Zap, label: 'Integrations' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'activity', icon: Activity, label: 'Activity' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`w-16 hover:w-64 flex flex-col h-screen bg-[#1c2128] border-r border-[#2d333b] transition-all duration-300 group z-50 overflow-visible shrink-0 fixed md:relative ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-[#2d333b]">
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#22272e] border border-[#2d333b] p-1.5 shadow-sm">
          <img src={NexoraLogo} alt="Nexora" className="w-full h-full object-contain" />
        </div>
        <div className="ml-3 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 overflow-hidden">
          <h1 className="text-sm font-bold text-white tracking-wide leading-tight">NEXORA</h1>
          <p className="text-[10px] text-slate-400 font-medium">Product Intelligence</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-hidden">
        {mainNavItems.map((item) => {
          const isActive = activeView === item.id || (activeView.startsWith(item.id + '/') && item.id === 'products');
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`
                flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer overflow-hidden
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(37,99,235,0.05)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d333b]/50 border border-transparent'}
              `}
            >
              <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
              <span className={`ml-3 text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'text-blue-500' : 'text-slate-300'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 flex flex-col gap-1.5 border-t border-[#2d333b] overflow-hidden">
        <button 
          onClick={() => setActiveView('settings')}
          className="flex items-center px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#2d333b]/50 transition-colors"
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          <span className="ml-3 text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Settings</span>
        </button>

        <button 
          onClick={() => setActiveView('help')}
          className="flex items-center px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#2d333b]/50 transition-colors"
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          <span className="ml-3 text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Support</span>
        </button>

        {/* User Profile */}
        <div className="relative mt-2 pt-2 border-t border-[#2d333b]/50">
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${activeView === 'profile' ? 'bg-[#2d333b] ring-1 ring-slate-600' : 'hover:bg-[#2d333b]/50'}`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-[#2d333b] border border-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
                {mockUser?.avatar ? (
                  <img src={mockUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-left whitespace-nowrap transition-opacity duration-300">
                <p className="text-[12px] font-semibold text-slate-200">{mockUser?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400">View Profile</p>
              </div>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="flex items-center px-3 py-2 mt-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span className="ml-3 text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sign out</span>
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
