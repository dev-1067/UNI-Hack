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

        {/* FAQ Section */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-industrial-warning" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-1">What does "Zero-Hallucination" mean?</h4>
              <p className="text-sm text-slate-400">Our AI uses Web Search Grounding (Tavily API) combined with strict Pydantic List of Values (LOV) validation to ensure no fake dimensions or metrics are ever output into the final CSV.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">How is the 252-column CSV generated?</h4>
              <p className="text-sm text-slate-400">The FastAPI backend (`backend/api.py`) receives the 50 core attributes from the AI Agent, maps them to the correct taxonomy, normalizes units (e.g. 1/2" to 0.5in), and pads the remaining 202 columns with empty strings.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Where is the code?</h4>
              <p className="text-sm text-slate-400">The entire architecture is located in the local codebase. The Frontend is in `frontend/`, Backend is in `backend/`, and the AI Orchestrator is in `ai_agent/`.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocsView;
