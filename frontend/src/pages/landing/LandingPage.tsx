import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import MonitorSection from '../../components/landing/MonitorSection';
import Architecture from '../../components/landing/Architecture';
import Footer from '../../components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MonitorSection />
        <Architecture />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
