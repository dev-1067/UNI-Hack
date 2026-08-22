import React from 'react';

import ScrollReveal from './ScrollReveal';

const IntegrationsSection = () => {
  return (
    <section id="integrations" className="py-16 md:py-24 bg-white relative z-10">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <ScrollReveal>
          <span className="font-label-md text-[13px] font-bold text-[#0B5CFF] uppercase tracking-wider mb-3 block">Connect &amp; Activate</span>
          <h2 className="font-headline-lg text-[28px] md:text-[34px] font-bold text-[#172033] mb-12 tracking-tight">
            Syndicate Anywhere.
          </h2>
        </ScrollReveal>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-5xl mx-auto">
          <ScrollReveal delay={100}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">Amazon</div></ScrollReveal>
          <ScrollReveal delay={200}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">Shopify</div></ScrollReveal>
          <ScrollReveal delay={300}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">Google Shopping</div></ScrollReveal>
          
          <ScrollReveal delay={400} className="mx-2 md:mx-6 z-10 relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0B5CFF] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(11,92,255,0.4)] relative">
              <span className="material-symbols-outlined text-[28px] md:text-[32px]">sync_alt</span>
              <div className="absolute inset-0 rounded-full border-2 border-[#0B5CFF] animate-ping opacity-30"></div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={500}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">Walmart</div></ScrollReveal>
          <ScrollReveal delay={600}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">Salesforce</div></ScrollReveal>
          
          <div className="w-full mt-2 md:mt-4 flex justify-center">
            <ScrollReveal delay={700}><div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-full text-[#172033] font-semibold text-sm md:text-base shadow-sm hover:border-[#0B5CFF]/30 hover:shadow-md transition-all cursor-default">SAP</div></ScrollReveal>
          </div>
        </div>
        
        <ScrollReveal delay={800}>
          <p className="mt-12 text-sm md:text-[15px] text-[#475569] px-4 max-w-2xl mx-auto leading-relaxed">
            Seamlessly push structured product data to your critical sales and operational destinations.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IntegrationsSection;
