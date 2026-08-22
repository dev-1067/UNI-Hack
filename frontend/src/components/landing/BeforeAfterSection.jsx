import React from 'react';

import ScrollReveal from './ScrollReveal';

const BeforeAfterSection = () => {
  return (
    <section id="transformation" className="py-12 md:py-16 bg-surface-subtle">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">From Chaos to Clarity</h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-16 items-center">
          {/* Before */}
          <ScrollReveal delay={100} className="bg-red-50/50 p-6 md:p-8 rounded-xl border border-red-200 relative mt-4 md:mt-0">
            <div className="absolute -top-4 left-6 md:left-8 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">Before NEXORA</div>
            <div className="space-y-4 font-mono text-sm md:text-base">
              <div className="p-3 md:p-4 bg-white/70 rounded border border-red-200 text-landing-text/70 flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="material-symbols-outlined text-red-400 mr-3 text-[20px]">cancel</span>
                <span className="truncate">SKU: 19283 | desc: blk tee lg | color: ? | size: L</span>
              </div>
              <div className="p-3 md:p-4 bg-white/70 rounded border border-red-200 text-landing-text/70 flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="material-symbols-outlined text-red-400 mr-3 text-[20px]">cancel</span>
                <span className="truncate">SKU: null | t-shirt black | clr: blk | sz: large</span>
              </div>
              <div className="p-3 md:p-4 bg-white/70 rounded border border-red-200 text-landing-text/70 flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                <span className="material-symbols-outlined text-red-400 mr-3 text-[20px]">cancel</span>
                <span className="truncate">ID_992 | Basic Tee | Black | MISSING_IMAGE</span>
              </div>
            </div>
          </ScrollReveal>
          
          {/* After */}
          <ScrollReveal delay={300} className="bg-teal-50/50 p-6 md:p-8 rounded-xl border border-teal-200 relative mt-4 md:mt-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 left-6 md:left-8 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">After NEXORA</div>
            <div className="space-y-4 font-mono text-sm md:text-base">
              <div className="p-3 md:p-4 bg-white rounded border border-teal-200 text-landing-navy flex items-start md:items-center shadow-sm">
                <span className="material-symbols-outlined text-teal-500 mr-3 text-[20px] mt-0.5 md:mt-0">check_circle</span>
                <div className="flex-1">
                  <div className="font-bold text-landing-blue">SKU: TEE-BLK-L</div>
                  <div className="text-xs md:text-sm text-landing-text/70 mt-1">Men's Classic Cotton T-Shirt - Black, Large</div>
                </div>
              </div>
              <div className="p-3 md:p-4 bg-white rounded border border-teal-200 text-landing-navy flex items-start md:items-center shadow-sm">
                <span className="material-symbols-outlined text-teal-500 mr-3 text-[20px] mt-0.5 md:mt-0">check_circle</span>
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs md:text-sm">
                    <div><span className="text-landing-text/60 font-medium">Color:</span> Black</div>
                    <div><span className="text-landing-text/60 font-medium">Size:</span> Large</div>
                    <div><span className="text-landing-text/60 font-medium">Material:</span> 100% Cotton</div>
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4 bg-white rounded border border-teal-200 text-landing-navy flex items-center shadow-sm bg-teal-50/30">
                <span className="material-symbols-outlined text-teal-500 mr-3 text-[20px]">check_circle</span>
                <span className="text-xs md:text-sm font-medium">Images: Validated (4) | Status: Ready for Channel</span>
              </div>
            </div>
          </ScrollReveal>
          
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
