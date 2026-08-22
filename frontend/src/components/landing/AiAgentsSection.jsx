import React from 'react';

import ScrollReveal from './ScrollReveal';

const AiAgentsSection = () => {
  return (
    <section id="autonomous" className="py-16 md:py-24 relative overflow-hidden bg-[#F8FAFD]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="font-label-md text-[13px] font-bold text-[#0B5CFF] uppercase tracking-wider mb-3 block">Autonomous Operations</span>
            <h2 className="font-headline-lg text-[32px] md:text-[40px] font-bold text-[#172033] mb-4 tracking-tight leading-tight">
              AI Agents That Don't Just Assist.<br />They Act.
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="relative w-full max-w-4xl mx-auto h-[450px] md:h-[600px] flex items-center justify-center scale-[0.7] sm:scale-75 md:scale-100 origin-center mt-4">
          {/* Central Hub */}
          <ScrollReveal delay={100} className="w-48 md:w-56 h-48 md:h-56 rounded-full bg-[#12254A] border border-[#0B5CFF]/40 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(11,92,255,0.3)] z-20 relative">
            <div className="absolute -inset-6 rounded-full bg-[#0B5CFF]/15 blur-2xl z-[-1]"></div>
            <span className="material-symbols-outlined text-[40px] md:text-[48px] text-[#EAF2FF] mb-2">smart_toy</span>
            <span className="text-white font-bold text-center text-xs md:text-sm px-4 leading-tight">NEXORA<br />Intelligence Engine</span>
          </ScrollReveal>
          
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{filter: 'drop-shadow(0 0 4px rgba(11,92,255,0.3))'}}>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="20%" y1="50%" y2="20%"></line>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="80%" y1="50%" y2="20%"></line>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="10%" y1="50%" y2="50%"></line>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="90%" y1="50%" y2="50%"></line>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="30%" y1="50%" y2="80%"></line>
            <line className="opacity-50" stroke="#0B5CFF" strokeDasharray="6 6" strokeWidth="2" x1="50%" x2="70%" y1="50%" y2="80%"></line>
          </svg>
          
          {/* Agent Nodes */}
          <ScrollReveal delay={200} className="absolute top-[10%] left-[10%] w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">auto_fix_high</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Enrichment</h4>
          </ScrollReveal>
          <ScrollReveal delay={300} className="absolute top-[10%] right-[10%] w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">verified_user</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Quality</h4>
          </ScrollReveal>
          <ScrollReveal delay={400} className="absolute top-[45%] left-0 w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">schema</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Mapping</h4>
          </ScrollReveal>
          <ScrollReveal delay={500} className="absolute top-[45%] right-0 w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">document_scanner</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Extraction</h4>
          </ScrollReveal>
          <ScrollReveal delay={600} className="absolute bottom-[10%] left-[20%] w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">storefront</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Channel</h4>
          </ScrollReveal>
          <ScrollReveal delay={700} className="absolute bottom-[10%] right-[20%] w-32 md:w-40 bg-white p-3 md:p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] z-20 agent-node border-t-4 border-t-[#0B5CFF] border-x border-b border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#0B5CFF] mb-2 text-[20px] md:text-[24px]">query_stats</span>
            <h4 className="font-bold text-xs md:text-[14px] text-[#172033]">Market Intel</h4>
          </ScrollReveal>
          
        </div>
      </div>
    </section>
  );
};

export default AiAgentsSection;
