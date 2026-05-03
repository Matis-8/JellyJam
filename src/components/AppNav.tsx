'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Play', href: '/game-setup-screen' },
  { label: 'How to Play', href: '/how-to-play-screen' },
];

export default function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <AppLogo size={36} />
          <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Jelly<span className="text-primary">Jam</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => {
            const isActive = pathname === link?.href;
            return (
              <Link
                key={`nav-${link?.href}`}
                href={link?.href}
                className={`px-4 py-2 rounded-xl text-sm font-600 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link?.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/game-setup-screen"
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-700 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Icon name="PlayIcon" size={16} variant="solid" />
            Start Game
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} />
        </button>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-2">
          {navLinks?.map((link) => {
            const isActive = pathname === link?.href;
            return (
              <Link
                key={`mobile-nav-${link?.href}`}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-600 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white' :'text-foreground hover:bg-secondary'
                }`}
              >
                {link?.label}
              </Link>
            );
          })}
          <Link
            href="/game-setup-screen"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 bg-primary text-white font-700 px-5 py-3 rounded-xl text-sm transition-all duration-200 active:scale-95"
          >
            <Icon name="PlayIcon" size={16} variant="solid" />
            Start Game
          </Link>
        </div>
      )}
    </header>
  );
}