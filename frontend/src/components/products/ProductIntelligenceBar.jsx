import React from 'react';
import { Sparkles, ArrowRight, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../ToastProvider';

const ProductIntelligenceBar = () => {
  const { addToast } = useToast();
  return (
    <div className="bg-slate-900 dark:bg-[#1c2128] rounded-xl border border-slate-800 dark:border-[#2d333b] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/30">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold tracking-wider text-blue-400 uppercase mb-0.5">NEXORA INTELLIGENCE</h4>
          <p className="text-sm font-medium text-slate-200">
            <span className="text-white font-bold">1,126 products</span> need attention to meet quality standards.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 relative z-10">
        <button onClick={() => addToast('Enriching data...', 'info')} className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded shadow-sm transition-colors">
          Enrich Missing Data
        </button>
        <button onClick={() => addToast('Fixing data quality issues...', 'info')} className="px-3 py-1.5 text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded shadow-sm transition-colors">
          Fix Quality Issues
        </button>
        <button onClick={() => addToast('Mapping attributes...', 'info')} className="px-3 py-1.5 text-xs font-semibold bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 rounded shadow-sm transition-colors">
          Map Attributes
        </button>
      </div>
    </div>
  );
};

export default ProductIntelligenceBar;
