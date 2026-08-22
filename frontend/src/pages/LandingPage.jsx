import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import ProcessSection from '../components/landing/ProcessSection';
import CorePlatformSection from '../components/landing/CorePlatformSection';
import AiAgentsSection from '../components/landing/AiAgentsSection';
import BeforeAfterSection from '../components/landing/BeforeAfterSection';
import IntegrationsSection from '../components/landing/IntegrationsSection';
import LandingFooter from '../components/landing/LandingFooter';
import '../styles/landing.css';

const LandingPage = ({ onNavigateLogin, onNavigateSignup }) => {
  return (
    <div className="landing-page bg-landing-bg text-landing-text antialiased selection:bg-landing-blue/20 selection:text-landing-navy relative">
      <LandingNavbar onNavigateLogin={onNavigateLogin} onNavigateSignup={onNavigateSignup} />
      <HeroSection onNavigateLogin={onNavigateLogin} />
      <ProcessSection />
      <CorePlatformSection />
      <AiAgentsSection />
      <BeforeAfterSection />
      <IntegrationsSection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
