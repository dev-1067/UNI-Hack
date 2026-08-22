import React from 'react';
import ScrollReveal from './ScrollReveal';

const ProcessSection = () => {
  return (
    <section id="process" className="py-16 md:py-24 bg-landing-surface relative backdrop-blur-sm">
      <style>{`
        @keyframes flow-horizontal {
          0% { left: -30%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes flow-vertical {
          0% { top: -30%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes subtle-glow {
          0% { box-shadow: 0 0 10px rgba(110, 168, 255, 0.1); }
          50% { box-shadow: 0 0 25px rgba(110, 168, 255, 0.5); }
          100% { box-shadow: 0 0 10px rgba(110, 168, 255, 0.1); }
        }
      `}</style>
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-lg text-[28px] md:text-[34px] font-bold text-landing-navy mb-4 leading-tight tracking-tight">
              Product Data Is the Foundation.<br />NEXORA Makes It Intelligent.
            </h2>
            <p className="font-body-md text-body-md text-landing-text/80">From chaotic data to refined commerce insights in three simple steps.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative">
            
            {/* Step 1: Raw Data */}
            <div className="w-full md:w-[28%] bg-white p-6 rounded-xl border border-landing-border shadow-sm flex flex-col items-center text-center z-10 relative">
              <div className="w-12 h-12 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 flex items-center justify-center mb-4 text-[#155EEF]">
                <span className="material-symbols-outlined text-[24px]">database</span>
              </div>
              <h3 className="font-headline-md text-body-lg font-bold text-landing-navy mb-2">Raw Product Data</h3>
              <p className="text-[13px] text-landing-text/70 leading-relaxed">Fragmented, unstructured, and incomplete data from multiple sources.</p>
            </div>
            
            {/* Arrow 1 Desktop */}
            <div className="hidden md:flex flex-1 items-center justify-center relative min-w-[100px]">
              <div className="w-full h-[2px] bg-[#155EEF]/15 relative overflow-hidden rounded-full">
                <div className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_8px_#0ea5e9]" style={{ animation: 'flow-horizontal 2.5s linear infinite' }}></div>
              </div>
              <span className="material-symbols-outlined absolute text-[#155EEF] right-[-8px] text-[20px]">arrow_forward</span>
            </div>
            
            {/* Arrow 1 Mobile */}
            <div className="md:hidden flex flex-col h-16 items-center justify-center relative z-0">
              <div className="w-[2px] h-full bg-[#155EEF]/15 relative overflow-hidden rounded-full">
                <div className="absolute left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_8px_#0ea5e9]" style={{ animation: 'flow-vertical 2.5s linear infinite' }}></div>
              </div>
              <span className="material-symbols-outlined absolute text-[#155EEF] bottom-[-8px] text-[20px]">arrow_downward</span>
            </div>
            
            {/* Step 2: NEXORA Engine */}
            <div className="w-full md:w-[32%] bg-[#111827] p-8 rounded-xl border border-[#155EEF]/30 shadow-[0_10px_40px_rgba(21,94,239,0.2)] flex flex-col items-center text-center z-20 relative overflow-hidden transform md:scale-110">
              <div className="w-16 h-16 rounded-full bg-[#1E293B] border border-[#155EEF]/30 flex items-center justify-center mb-4 text-[#6EA8FF] relative z-10" style={{ animation: 'subtle-glow 3s ease-in-out infinite' }}>
                <span className="material-symbols-outlined text-[32px]">memory</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-bold text-white mb-2 relative z-10">NEXORA Engine</h3>
              <p className="text-[13px] text-[#94A3B8] relative z-10 leading-relaxed">AI-driven processing, mapping,<br />enrichment, and validation.</p>
            </div>
            
            {/* Arrow 2 Desktop */}
            <div className="hidden md:flex flex-1 items-center justify-center relative min-w-[100px]">
              <div className="w-full h-[2px] bg-[#155EEF]/15 relative overflow-hidden rounded-full">
                <div className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_8px_#0ea5e9]" style={{ animation: 'flow-horizontal 2.5s linear infinite 1.25s' }}></div>
              </div>
              <span className="material-symbols-outlined absolute text-[#155EEF] right-[-8px] text-[20px]">arrow_forward</span>
            </div>
            
            {/* Arrow 2 Mobile */}
            <div className="md:hidden flex flex-col h-16 items-center justify-center relative z-0">
              <div className="w-[2px] h-full bg-[#155EEF]/15 relative overflow-hidden rounded-full">
                <div className="absolute left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_8px_#0ea5e9]" style={{ animation: 'flow-vertical 2.5s linear infinite 1.25s' }}></div>
              </div>
              <span className="material-symbols-outlined absolute text-[#155EEF] bottom-[-8px] text-[20px]">arrow_downward</span>
            </div>
            
            {/* Step 3: Product Intelligence */}
            <div className="w-full md:w-[28%] bg-white p-6 rounded-xl border border-landing-border shadow-sm flex flex-col items-center text-center z-10 relative">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 text-teal-600">
                <span className="material-symbols-outlined text-[24px]">insights</span>
              </div>
              <h3 className="font-headline-md text-body-lg font-bold text-landing-navy mb-2">Product Intelligence</h3>
              <p className="text-[13px] text-landing-text/70 leading-relaxed">Structured, enriched, ready-to-use data for every channel.</p>
            </div>
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProcessSection;
