import React, { useEffect } from 'react';
import { Search, FolderGit2, Settings, HelpCircle } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, setActiveView }) => {
  // Listen for escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'catalogs', icon: FolderGit2, label: 'Go to Extraction Workspace' },
    { id: 'dashboard', icon: Search, label: 'View Analytics Dashboard' },
    { id: 'settings', icon: Settings, label: 'Open Settings' },
    { id: 'help', icon: HelpCircle, label: 'Documentation' },
  ];

  const handleSelect = (id) => {
    setActiveView(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-industrial-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-industrial-800/90 border border-industrial-700/50 shadow-2xl rounded-sm overflow-hidden animate-modal-pop backdrop-blur-md">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-industrial-700/50 bg-industrial-900/50">
          <Search className="w-5 h-5 text-industrial-accent" />
          <input 
            type="text" 
            autoFocus
            placeholder="Type a command or search..." 
            className="w-full bg-transparent border-none outline-none text-white px-3 py-2 text-lg placeholder:text-slate-500"
          />
          <kbd className="px-2 py-1 bg-industrial-800 border border-industrial-700 rounded text-xs text-slate-400 font-mono">ESC</kbd>
        </div>

        {/* Command List */}
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggestions</p>
          <div className="flex flex-col gap-1">
            {commands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.id)}
                className="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-industrial-700/50 text-slate-300 hover:text-white transition-colors w-full text-left group"
              >
                <cmd.icon className="w-5 h-5 text-slate-400 group-hover:text-industrial-accent" />
                <span className="font-medium">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;
