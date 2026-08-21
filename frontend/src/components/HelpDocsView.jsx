import React from 'react';
import { BookOpen, HelpCircle, Cpu } from 'lucide-react';

const HelpDocsView = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-6">Documentation & Help</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Start Guide */}
          <div className="glass-panel p-6 replit-transition hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <BookOpen className="w-8 h-8 text-industrial-accent mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Quick Start Guide</h3>
            <p className="text-sm text-slate-400 mb-4">Learn how to upload PDFs, run the AI extraction pipeline, and review the 252-column output.</p>
            <button className="text-sm font-bold text-industrial-accent hover:text-white transition-colors">Read Guide →</button>
          </div>

          {/* Architecture Specs */}
          <div className="glass-panel p-6 replit-transition hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <Cpu className="w-8 h-8 text-industrial-success mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">System Architecture</h3>
            <p className="text-sm text-slate-400 mb-4">Deep dive into the 7-Step pipeline, Web Search Grounding, and FastAPI backend structure.</p>
            <button className="text-sm font-bold text-industrial-success hover:text-white transition-colors">View Specs →</button>
          </div>
        </div>

        {/* Advanced Pipeline Guide */}
        <div className="glass-panel p-6 border-l-4 border-l-accent-cyan">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent-cyan" /> Autonomous Web Grounding Pipeline
          </h2>
          <div className="space-y-6">
            <div className="bg-cmd-900/50 p-4 rounded-sm border border-white/5">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-xs">1</span>
                Vision-Language Parsing
              </h4>
              <p className="text-sm text-slate-400">The pipeline intercepts unstructured PDF catalogs and raw images. Using spatial reasoning, the AI extracts the base SKU parameters even from heavily nested tables and fuzzy marketing text.</p>
            </div>
            
            <div className="bg-cmd-900/50 p-4 rounded-sm border border-white/5">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-industrial-warning/20 text-industrial-warning flex items-center justify-center text-xs">2</span>
                Live Web Search Grounding
              </h4>
              <p className="text-sm text-slate-400">Missing attributes (like electrical phase, max RPM, or blade thickness) trigger automated web queries. The agent cross-references manufacturer sites in real-time, effectively eliminating manual data entry.</p>
            </div>

            <div className="bg-cmd-900/50 p-4 rounded-sm border border-white/5">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-industrial-success/20 text-industrial-success flex items-center justify-center text-xs">3</span>
                Pydantic Strict Typing & Export
              </h4>
              <p className="text-sm text-slate-400">Extracted data is passed through rigorous backend validation rules (LOVs). Once verified, the data is seamlessly structured into the standard 252-column e-commerce format for final ERP ingestion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocsView;
