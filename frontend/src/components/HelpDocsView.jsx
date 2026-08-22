import React from 'react';
import { BookOpen, HelpCircle, Cpu } from 'lucide-react';

const HelpDocsView = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 animate-fade-in bg-slate-50 dark:bg-transparent">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Documentation & Help</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Start Guide */}
          <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Quick Start Guide</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Learn how to upload PDFs, run the AI extraction pipeline, and review the 252-column output.</p>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Read Guide →</button>
          </div>

          {/* Architecture Specs */}
          <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6 transition-all hover:-translate-y-1 hover:shadow-md">
            <Cpu className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">System Architecture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Deep dive into the 7-Step pipeline, Web Search Grounding, and FastAPI backend structure.</p>
            <button className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">View Specs →</button>
          </div>
        </div>

        {/* Video Tutorials Section */}
        <div className="bg-white dark:bg-[#22272e] rounded-xl border border-slate-200 dark:border-[#2d333b] shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> Video Masterclasses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tutorial 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 relative overflow-hidden border border-slate-200 dark:border-slate-700/50 group-hover:border-blue-500 transition-colors">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" alt="Data mapping" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-blue-500/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-1 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Advanced Taxonomy Mapping</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Master the visual mapping tools to connect your custom ERP fields to NEXORA's standard taxonomy.</p>
            </div>
            
            {/* Tutorial 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 relative overflow-hidden border border-slate-200 dark:border-slate-700/50 group-hover:border-teal-500 transition-colors">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" alt="Code automation" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-teal-500/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-1 text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Automated Quality Rules</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set up custom rule engines to automatically flag inconsistencies in supplier data uploads.</p>
            </div>

            {/* Tutorial 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 relative overflow-hidden border border-slate-200 dark:border-slate-700/50 group-hover:border-indigo-500 transition-colors">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" alt="Export pipelines" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-1 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Custom Export Pipelines</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Build and schedule automated exports directly to Salesforce, Shopify, and Amazon Vendor Central.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocsView;
