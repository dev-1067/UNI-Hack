import React, { useState, useEffect } from 'react';

const LandingNavbar = ({ onNavigateLogin, onNavigateSignup }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      // Sections strictly in DOM order
      const sections = ['hero', 'core-platform', 'autonomous', 'transformation', 'integrations'];
      let current = 'hero';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Navbar is 80px tall. Use 200px offset to detect section arrival
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Calculate top position factoring in 80px fixed header height
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Update active section immediately on click
      setActiveSection(id);
      
      // Subtle section arrival glow effect
      element.classList.add('animate-section-arrival');
      setTimeout(() => {
        element.classList.remove('animate-section-arrival');
      }, 900);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Product', id: 'hero' },
    { label: 'Features', id: 'core-platform' },
    { label: 'AI Agents', id: 'autonomous' },
    { label: 'About Us', id: 'transformation' },
    { label: 'Integrations', id: 'integrations' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-landing-border shadow-sm">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto h-20">
        <div className="flex items-center gap-2 cursor-pointer transition-transform duration-250 hover:scale-[1.05]" onClick={(e) => scrollToSection(e, 'hero')}>
          <img
            alt="NEXORA Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5775eaov6JtiKDnOgXLzkG7gj6zUz0Lm1cFpyXVXR3hhHoy0fk6k3nxk7CENAXO6HluWJc1CoK04nMgTdsj0rS1hxjsZlw-IxU2fTjIdJObL2WZ-i_pgeel_g9Ow-ur_PX2omLGjOPd3epco91dtZW0dxuX0B2oC1YuJ2kI3zK97w4_3xEjA8aeqjCrFIS3AjXaVBXruC1ajOQISW7Scme4vY-bZb5rzat3CBReeKGSyxI78wnyfruBT10oZq0YOzbhs"
          />
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-landing-navy">
            NEXORA
          </span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative inline-block font-body-md text-body-md transition-all duration-250 py-1 hover:scale-[1.10] transform origin-center ${
                  isActive
                    ? 'text-landing-blue font-bold'
                    : 'text-landing-text/70 hover:text-landing-blue'
                }`}
              >
                {item.label}
                {/* Animated underline */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-landing-blue transition-all duration-300 rounded-full ${
                  isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}></span>
              </a>
            );
          })}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={onNavigateLogin}
            className="font-body-md text-body-md font-medium text-landing-navy hover:text-landing-blue hover:scale-[1.08] transition-all duration-250 transform"
          >
            Login
          </button>
          <button
            onClick={onNavigateSignup}
            className="group flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#062F35] hover:bg-landing-blue text-white font-body-md text-body-md font-bold shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-250 transform"
          >
            Get Started
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-250">arrow_forward</span>
          </button>
        </div>
        
        <div className="flex lg:hidden items-center">
          <button
            className="text-landing-navy hover:text-landing-blue transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[32px]">menu</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden bg-white border-b border-landing-border px-margin-mobile flex flex-col gap-4 py-4 absolute w-full transition-all duration-300 ease-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 py-0 border-b-0'
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`relative w-fit font-body-md text-body-md transition-all duration-250 transform origin-left hover:scale-[1.05] ${
                isActive
                  ? 'text-landing-blue font-bold'
                  : 'text-landing-text/70 hover:text-landing-blue'
              }`}
            >
              {item.label}
              {/* Animated underline on mobile too */}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-landing-blue transition-all duration-300 rounded-full ${
                isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}></span>
            </a>
          );
        })}
        
        <div className="border-t border-landing-border pt-4 mt-2 flex flex-col gap-4">
          <button
            onClick={onNavigateLogin}
            className="w-fit font-body-md text-body-md font-medium text-landing-navy hover:text-landing-blue hover:scale-[1.05] transition-all duration-250 transform origin-left text-left"
          >
            Login
          </button>
          <button
            onClick={onNavigateSignup}
            className="group flex items-center justify-center gap-1.5 px-5 py-2.5 w-full rounded-full bg-[#062F35] hover:bg-landing-blue text-white font-body-md text-body-md font-bold shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-250 transform"
          >
            Get Started
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-250">arrow_forward</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
