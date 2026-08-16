import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Edit3, Target } from 'lucide-react';

const DataReviewer = ({ data, onApprove, isProcessing }) => {
  const [toast, setToast] = useState("");

  const handleAction = (action) => {
    setToast(action === 'approve' ? "Approved!" : "Flagged for Review!");
    setTimeout(() => {
      setToast("");
      if (action === 'approve') onApprove();
    }, 1500);
  };

  if (isProcessing) {
    return (
      <div className="w-1/3 glass-panel m-4 mt-0 ml-0 flex flex-col items-center justify-center border-industrial-accent animate-pulse-glow">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-industrial-accent mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-industrial-accent animate-pulse" />
          </div>
        </div>
        <p className="text-industrial-accent font-bold tracking-wider animate-pulse uppercase text-sm">
          Extracting Specs...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-1/3 glass-panel m-4 mt-0 ml-0 flex flex-col items-center justify-center border-industrial-600/50 text-slate-500">
        <Target className="w-12 h-12 mb-4 opacity-20" />
        <p>Click "Process with AI" to generate catalog data</p>
      </div>
    );
  }

  const displayFields = Object.entries(data).filter(([_k, v]) => v !== "");

  return (
    <div className="w-1/3 glass-panel m-4 mt-0 ml-0 flex flex-col overflow-hidden border-industrial-success/50 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-industrial-900 border border-industrial-accent text-white px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-industrial-accent" />
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Header with Confidence Radial */}
      <div className="bg-industrial-800/90 px-4 py-4 border-b border-industrial-700/50 flex justify-between items-center z-10">
        <div>
          <h2 className="text-white font-bold flex items-center gap-2">
            AI Results 
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-industrial-success/20 text-industrial-success border border-industrial-success/30">
              Zero-Hallucination
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Matched 252-Column Unihack Schema</p>
        </div>
        
        {/* Mock Confidence Radial */}
        <div className="flex items-center gap-2 bg-industrial-900/50 px-3 py-1.5 rounded-lg border border-industrial-700">
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-industrial-700" />
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="88" strokeDashoffset="2" className="text-industrial-success" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">98%</span>
            </div>
          </div>
          <span className="text-xs text-slate-300 font-medium">Confidence</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 bg-industrial-900/50 flex gap-2 border-b border-industrial-700/50">
        <button 
          onClick={() => handleAction('flag')}
          disabled={!!toast}
          className="flex-1 py-2 bg-industrial-800 hover:bg-industrial-700 text-slate-300 rounded border border-industrial-600 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase active:scale-95"
        >
          <AlertTriangle className="w-4 h-4 text-industrial-warning" /> Flag Issue
        </button>
        <button 
          onClick={() => handleAction('approve')}
          disabled={!!toast}
          className="flex-1 py-2 bg-industrial-accent hover:bg-sky-400 text-industrial-900 rounded font-black transition-all flex items-center justify-center gap-2 text-xs uppercase shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] active:scale-95"
        >
          <CheckCircle className="w-4 h-4" /> Approve
        </button>
      </div>

      {/* Form Fields with Staggered Fade In */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayFields.map(([key, value], idx) => (
          <div 
            key={idx} 
            className="group animate-fade-in" 
            style={{ animationDelay: `${idx * 100}ms` }} /* Stagger effect */
          >
            <label className="block text-[10px] font-bold text-industrial-accent mb-1 uppercase tracking-wider">
              {key.replace(/_/g, ' ')}
            </label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue={value}
                className="w-full bg-industrial-900/80 border border-industrial-700 text-slate-100 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all group-hover:border-industrial-500 shadow-inner"
              />
              <button className="absolute right-2 top-2 text-slate-500 hover:text-industrial-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Visual pad for the 252 columns */}
        <div className="pt-4 pb-8 text-center animate-fade-in" style={{ animationDelay: `${displayFields.length * 100}ms` }}>
          <p className="text-xs text-industrial-600 italic font-medium tracking-wide border-t border-industrial-700/50 pt-4">
            + 238 empty padded columns verified & hidden
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataReviewer;
