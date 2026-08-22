import React from 'react';

import ScrollReveal from './ScrollReveal';

const LandingFooter = () => {
  return (
    <footer className="w-full py-12 md:py-16 bg-[#F3F4F6] relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <ScrollReveal className="col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img 
              alt="NEXORA Logo" 
              className="h-6 w-auto" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW4MaPB7Di36xyNaqV9cm9WFw0CO_pyafUrrqV5VcOfS-1EtImVA5Byis_RehwNEmpNr4k17tuN_k23a7_JQKZALgLSSlYBmiV05Bjzn3KmOzcZbwI_Dx5GiOGEcB6Q6iVrSjzSGktKp7h-oQ9pq70J1ceuRYH8IGKSbXvRdN1dJOs3rUI5ipeJnkBNJCE13AmJzGbkpt3sc0X0pzEFrHD3uvz0QDQpOwKE-gWcGTFkzHyI-1BetUtdDykjrqNpV3Mnkg"
            />
            <span className="text-[20px] font-bold text-[#172033]">NEXORA</span>
          </div>
          <p className="text-[14px] text-[#475569] mb-8">AI-Powered Product Intelligence Platform.</p>
          <p className="text-[13px] text-[#94A3B8]">© 2026 NEXORA. All rights reserved.</p>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h4 className="text-[13px] font-bold text-[#172033] mb-5 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-4 text-[14px]">
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#process">Product</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#core-platform">Solutions</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#autonomous">Capabilities</a></li>
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <h4 className="text-[13px] font-bold text-[#172033] mb-5 uppercase tracking-wider">Company</h4>
          <ul className="space-y-4 text-[14px]">
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#integrations">Partners</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#">About Us</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#">Careers</a></li>
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <h4 className="text-[13px] font-bold text-[#172033] mb-5 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-4 text-[14px]">
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#transformation">Documentation</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#">Blog</a></li>
            <li><a className="text-[#475569] hover:text-[#0B5CFF] transition-colors duration-200" href="#">Community</a></li>
          </ul>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default LandingFooter;
