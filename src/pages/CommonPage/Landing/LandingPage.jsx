import React from 'react';
import HeroSection from './HeroSection/HeroSection';
import FeatureSection from './FeatureSection/FeatureSection';
import LandlordSection from './LandlordSection/LandlordSection';
import TenantSection from './TenantSection/TenantSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import CTASection from './CTASection/CTASection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <main className="landing-content">
        <HeroSection />
        <FeatureSection />
        <LandlordSection />
        <TenantSection />
        <TestimonialSection />
        <CTASection />
      </main>
    </div>
  );
};

export default LandingPage;
