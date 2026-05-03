import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeroSection from './components/HeroSection';
import GameModesSection from './components/GameModesSection';
import HowItWorksPreview from './components/HowItWorksPreview';
import HomeFooter from './components/HomeFooter';

export default function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <GameModesSection />
      <HowItWorksPreview />
      <HomeFooter />
    </AppLayout>
  );
}