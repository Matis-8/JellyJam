import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function HomeFooter() {
  return (
    <footer
      className="px-8 lg:px-16 xl:px-20 py-8"
      style={{
        background: '#0D1F1A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AppLogo size={26} />
          <span className="font-700 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Math<span style={{ color: '#0D9488' }}>Arena</span>
          </span>
        </div>

        <nav className="flex gap-6 text-xs font-500" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/game-setup-screen" className="hover:text-white transition-colors">Play</Link>
          <Link href="/how-to-play-screen" className="hover:text-white transition-colors">How to Play</Link>
        </nav>

        <p className="text-xs font-400" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Free to use. No login needed.
        </p>
      </div>
    </footer>
  );
}