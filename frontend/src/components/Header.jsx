import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Bell, User, Sun, Moon, Menu, Settings, LogOut } from 'lucide-react';
import { useToast } from './ToastProvider';

const Header = ({ onOpenCommandPalette, theme, toggleTheme, onToggleSidebar, setActiveView, mockUser, onLogout }) => {
  const { addToast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="h-16 bg-[#f8f9fc] dark:bg-[#1a1f26] border-b border-slate-200 dark:border-[#2d333b] flex items-center px-6 z-40 relative transition-colors duration-300">
      
      {/* Left: Search Bar & Mobile Menu */}
      <div className="flex-1 flex items-center gap-2 md:gap-4">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div 
          onClick={onOpenCommandPalette}
          className="relative flex items-center w-full max-w-xs bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#2d333b] hover:border-slate-300 dark:hover:border-blue-500/50 rounded-md transition-colors cursor-pointer group shadow-sm"
        >
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
          <div className="w-full bg-transparent border-none outline-none text-xs text-slate-400 dark:text-slate-500 py-2 pl-9 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
            Search...
          </div>
        </div>
      </div>
      {/* Right: Actions */}
      <div className="flex-1 flex items-center justify-end gap-5">
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" 
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button onClick={() => setActiveView('help')} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hidden sm:block" title="Help & Support">
          <HelpCircle className="w-4 h-4" />
        </button>
        
        <button onClick={() => addToast('You have no new notifications.', 'info')} className="relative text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#1a1f26]"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
              isProfileOpen 
                ? 'bg-slate-300 border-slate-400 dark:bg-[#3d444d] dark:border-slate-500' 
                : 'bg-slate-200 border-slate-300 dark:bg-[#2d333b] dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-[#3d444d]'
            }`}
          >
            {mockUser?.avatar ? (
              <img src={mockUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#22272e] border border-slate-200 dark:border-[#3d444d] shadow-xl rounded-lg overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-[#2d333b] bg-slate-50/50 dark:bg-[#1c2128]">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{mockUser?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{mockUser?.email || 'user@example.com'}</p>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => { setActiveView('profile'); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d333b] rounded-md transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={() => { setActiveView('settings'); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d333b] rounded-md transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <button 
                  onClick={() => { setActiveView('help'); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d333b] rounded-md transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> Help & Support
                </button>
              </div>
              <div className="p-1 border-t border-slate-100 dark:border-[#2d333b]">
                <button 
                  onClick={() => { onLogout(); setIsProfileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
