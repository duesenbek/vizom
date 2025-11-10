import React from 'react';
import Hero from './components/Hero';
import LiveDemo from './components/LiveDemo';
import Features from './components/Features';
import Gallery from './components/Gallery';
import QuickStart from './components/QuickStart';
import TrustSignals from './components/TrustSignals';

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <LiveDemo />
      <Features />
      <Gallery />
      <QuickStart />
      <TrustSignals />
      <footer className="text-center py-10 text-sm text-gray-500">© 2024 Vizom • Powered by DeepSeek</footer>
    </div>
  );
}
