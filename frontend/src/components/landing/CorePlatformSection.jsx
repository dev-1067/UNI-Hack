import React from 'react';

import ScrollReveal from './ScrollReveal';

const CorePlatformSection = () => {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="core-platform" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        <ScrollReveal>
          <div className="mb-12 md:mb-16">
            <span className="font-label-md text-[13px] font-bold text-[#0B5CFF] uppercase tracking-wider mb-3 block">Core Platform</span>
            <h2 className="font-headline-lg text-[32px] md:text-[40px] font-bold text-[#172033] tracking-tight">The Intelligence Layer for Commerce</h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <ScrollReveal delay={100} className="group bg-[#F1F5F9]/50 border border-[#E2E8F0] p-8 md:p-10 rounded-2xl hover:bg-white hover:border-[#0B5CFF]/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.08)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center mb-6 text-[#0B5CFF] group-hover:bg-[#0B5CFF] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">AI Product Intelligence</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Centralized brain for all your product data operations.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'hero')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
          {/* Card 2 - Highlighted */}
          <ScrollReveal delay={200} className="group bg-white border border-[#0B5CFF]/15 shadow-sm p-8 md:p-10 rounded-2xl hover:border-[#0B5CFF]/40 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.12)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B5CFF] flex items-center justify-center mb-6 text-white group-hover:bg-[#0B5CFF]/90 transition-colors shadow-md shadow-[#0B5CFF]/20">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">Product Information Management</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Modern, scalable PIM built for complex catalogs.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'process')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
          {/* Card 3 */}
          <ScrollReveal delay={300} className="group bg-[#F1F5F9]/50 border border-[#E2E8F0] p-8 md:p-10 rounded-2xl hover:bg-white hover:border-[#0B5CFF]/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.08)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center mb-6 text-[#0B5CFF] group-hover:bg-[#0B5CFF] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">AI Enrichment</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Automatically generate attributes, descriptions, and metadata.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'autonomous')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
          {/* Card 4 */}
          <ScrollReveal delay={100} className="group bg-[#F1F5F9]/50 border border-[#E2E8F0] p-8 md:p-10 rounded-2xl hover:bg-white hover:border-[#0B5CFF]/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.08)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center mb-6 text-[#0B5CFF] group-hover:bg-[#0B5CFF] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">fact_check</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">Data Quality</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Automated validation rules and anomaly detection.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'autonomous')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
          {/* Card 5 */}
          <ScrollReveal delay={200} className="group bg-[#F1F5F9]/50 border border-[#E2E8F0] p-8 md:p-10 rounded-2xl hover:bg-white hover:border-[#0B5CFF]/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.08)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center mb-6 text-[#0B5CFF] group-hover:bg-[#0B5CFF] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">group_add</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">Supplier Onboarding</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Streamline ingestion from thousands of vendors instantly.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'transformation')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
          {/* Card 6 */}
          <ScrollReveal delay={300} className="group bg-[#F1F5F9]/50 border border-[#E2E8F0] p-8 md:p-10 rounded-2xl hover:bg-white hover:border-[#0B5CFF]/30 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(11,92,255,0.08)] hover:-translate-y-2 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] flex items-center justify-center mb-6 text-[#0B5CFF] group-hover:bg-[#0B5CFF] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#172033] mb-3">Channel Activation</h3>
              <p className="text-[14px] leading-relaxed text-[#475569]">Syndicate perfect data to any commerce endpoint seamlessly.</p>
            </div>
            <a 
              className="inline-flex items-center text-[14px] font-bold text-[#0B5CFF] mt-8 group-hover:translate-x-1 transition-transform cursor-pointer" 
              onClick={(e) => scrollToSection(e, 'integrations')}
            >
              Explore <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </a>
          </ScrollReveal>
          
        </div>
      </div>
    </section>
  );
};

export default CorePlatformSection;
