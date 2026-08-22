import React from 'react';
import ScrollReveal from './ScrollReveal';

const HeroSection = ({ onNavigateLogin }) => {
  return (
    <section id="hero" className="relative pt-16 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-landing-bg">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl relative order-2 lg:order-1 mt-8 lg:mt-0">
            <ScrollReveal>
              <div className="pulse-dot hidden lg:block"></div>
              <div className="pulse-dot hidden lg:block"></div>
              <div className="pulse-dot hidden lg:block"></div>
            
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F0F6FF] border border-[#AECBFA] mb-6 shadow-sm">
              <span className="font-label-md text-[11px] md:text-[12px] font-bold text-[#0B5CFF] uppercase tracking-wider">AI-POWERED PRODUCT INTELLIGENCE</span>
            </div>
            
            <h1 className="font-display-lg text-[40px] leading-[48px] md:text-display-lg md:text-[56px] md:leading-[64px] font-bold text-landing-navy mb-6 tracking-tight">
              Turn Product Data Into Product Intelligence.
            </h1>
            
            <p className="font-body-lg text-body-md md:text-body-lg text-landing-text/80 mb-8 leading-relaxed">
              Transform fragmented, messy supplier and product data into a structured, intelligent product foundation. NEXORA helps teams centralize information, automate enrichment, improve data quality, and activate products across every commerce channel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onNavigateLogin}
                className="explore-btn inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[#155EEF] text-white font-body-lg text-body-lg font-medium hover:bg-[#0B5BD3] transition-all shadow-[0_4px_14px_0_rgba(21,94,239,0.39)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.23)] hover:-translate-y-1"
              >
                Explore NEXORA
              </button>
            </div>
            </ScrollReveal>
          </div>
          
          {/* Right Dashboard Mockup */}
          <div className="relative h-[450px] md:h-[500px] lg:h-[600px] flex items-center justify-center order-1 lg:order-2 w-full max-w-[600px] mx-auto">
            <ScrollReveal delay={150} className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-landing-blue/15 to-teal-600/10 rounded-full blur-3xl opacity-60"></div>
              <div className="relative w-full h-full glass-card rounded-xl shadow-2xl border border-landing-border overflow-hidden flex flex-col bg-white/90 animate-float scale-95 md:scale-100 origin-center">
                
                {/* Faux Browser/Dashboard Header */}
              <div className="h-10 bg-white border-b border-landing-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="ml-4 h-6 w-56 bg-landing-bg rounded-md text-[11px] flex items-center px-3 text-landing-text/70 border border-landing-border font-medium">app.nexora.com/intelligence</div>
              </div>
              
              {/* Dashboard Body */}
              <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-5 overflow-hidden">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-headline-md text-[20px] md:text-headline-md font-bold text-landing-navy flex items-center gap-2">
                      Product Hub 
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    </h3>
                    <p className="text-[13px] text-landing-text/70 font-medium mt-0.5">Live Catalog Intelligence</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-landing-bg border border-landing-border hover:bg-landing-border/80 cursor-pointer transition-colors rounded-md text-[13px] font-semibold text-landing-navy flex items-center">Export</div>
                    <div className="px-3 py-1.5 bg-[#155EEF] hover:bg-[#0B5BD3] transition-colors cursor-pointer text-white rounded-md text-[13px] font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">add</span> New Connection
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-white p-3 md:p-4 rounded-lg border border-landing-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#155EEF]/30"></div>
                    <div className="text-[11px] text-landing-text/70 mb-1 uppercase font-bold tracking-wider">Total SKUs</div>
                    <div className="text-xl md:text-2xl font-bold text-landing-navy">1.2M</div>
                    <div className="text-[11px] text-emerald-600 mt-1.5 flex items-center bg-emerald-50 border border-emerald-100 w-max px-1.5 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5.2%
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 md:p-4 rounded-lg border border-landing-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/40"></div>
                    <div className="text-[11px] text-landing-text/70 mb-1 uppercase font-bold tracking-wider">Data Quality</div>
                    <div className="text-xl md:text-2xl font-bold text-teal-600 flex items-baseline gap-1">98.4% <span className="text-[10px] text-teal-600/70 font-normal">Score</span></div>
                    <div className="w-full bg-landing-bg h-1.5 rounded-full mt-2 border border-landing-border">
                      <div className="bg-teal-600 h-1.5 rounded-full relative" style={{ width: '98.4%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 md:p-4 rounded-lg border border-landing-border shadow-sm relative overflow-hidden ring-1 ring-[#155EEF]/10">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#155EEF]"></div>
                    <div className="text-[11px] text-landing-text/70 mb-1 uppercase font-bold tracking-wider">AI Enriched</div>
                    <div className="text-xl md:text-2xl font-bold text-[#155EEF]">845k</div>
                    <div className="text-[11px] text-[#155EEF] mt-1.5 flex items-center bg-[#155EEF]/10 border border-[#155EEF]/20 w-max px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[12px] mr-1">auto_awesome</span> Active Sync
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-lg border border-landing-border shadow-sm p-4 relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[13px] font-bold text-landing-navy">Enrichment Activity</div>
                    <div className="text-[11px] font-semibold text-landing-text/70 px-2 py-1 bg-landing-bg rounded-md border border-landing-border">Last 7 Days</div>
                  </div>
                  
                  {/* Mock Chart Lines Detailed */}
                  <div className="flex-1 relative flex items-end gap-1.5 md:gap-2 pb-1">
                    {/* Background grid lines */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between z-0 pointer-events-none opacity-40">
                      <div className="w-full border-t border-dashed border-landing-border"></div>
                      <div className="w-full border-t border-dashed border-landing-border"></div>
                      <div className="w-full border-t border-dashed border-landing-border"></div>
                      <div className="w-full border-t border-landing-border"></div>
                    </div>
                    
                    {/* Bars */}
                    <div className="w-full h-full flex items-end gap-1.5 md:gap-2 z-10 relative px-1">
                      {[
                        { height: 40, label: '12k rows', opacity: 'bg-[#155EEF]/20 hover:bg-[#155EEF]/40' },
                        { height: 60, label: '18k rows', opacity: 'bg-[#155EEF]/30 hover:bg-[#155EEF]/50' },
                        { height: 30, label: '9k rows',  opacity: 'bg-[#155EEF]/20 hover:bg-[#155EEF]/40' },
                        { height: 80, label: '24k rows', opacity: 'bg-[#155EEF]/50 hover:bg-[#155EEF]/70' },
                        { height: 70, label: '21k rows', opacity: 'bg-[#155EEF]/60 hover:bg-[#155EEF]/80' },
                        { height: 90, label: '27k rows', opacity: 'bg-[#155EEF]/80 hover:bg-[#155EEF]' }
                      ].map((bar, i) => (
                        <div key={i} className={`w-full ${bar.opacity} rounded-t-sm transition-colors relative group`} style={{ height: `${bar.height}%` }}>
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                            {bar.label}
                          </div>
                        </div>
                      ))}
                      
                      {/* Active Today Bar */}
                      <div className="w-full h-[100%] bg-[#155EEF] rounded-t-sm relative group cursor-pointer shadow-[0_-2px_10px_rgba(21,94,239,0.3)]">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_0_2px_#155EEF] group-hover:scale-110 transition-transform"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md">
                          32k rows
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-landing-text/70 font-medium mt-2 px-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    <span className="text-[#155EEF] font-bold">Today</span>
                  </div>
                </div>
              </div>
            </div>
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
