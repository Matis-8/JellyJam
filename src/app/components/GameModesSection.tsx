'use client';
import React from 'react';
import Link from 'next/link';
import {
  MathSymbolPlus, MathSymbolMinus, MathSymbolTimes, MathSymbolDiv,
  ToyBook, ToyBrain, ToyMagnifier, ToyLightbulb,
  CartoonOwl, CartoonUnicorn, CartoonDragon, CartoonRobot,
} from '@/components/ui/ToyDecorations';

interface GameMode {
  id: string;
  label: string;
  tagline: string;
  accent: string;
  accentLight: string;
  description: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  Icon: React.FC<{ className?: string }>;
  Character: React.FC<{ className?: string }>;
  featured?: boolean;
}

const modes: GameMode[] = [
  {
    id: 'multiplication',
    label: 'Multiply',
    tagline: 'Times tables under pressure',
    accent: '#0D9488',
    accentLight: '#CCFBF1',
    description: 'Speed and recall  who knows their times tables cold?',
    badge: 'Math',
    badgeColor: '#0F766E',
    badgeBg: '#CCFBF1',
    Icon: MathSymbolTimes,
    Character: CartoonRobot,
    featured: true,
  },
  {
    id: 'addition',
    label: 'Addition',
    tagline: 'Add it up fast',
    accent: '#2563EB',
    accentLight: '#EFF6FF',
    description: 'Race to find the sum. Great for beginners.',
    badge: 'Math',
    badgeColor: '#1D4ED8',
    badgeBg: '#DBEAFE',
    Icon: MathSymbolPlus,
    Character: CartoonOwl,
  },
  {
    id: 'subtraction',
    label: 'Subtraction',
    tagline: 'Find the difference',
    accent: '#DC2626',
    accentLight: '#FEF2F2',
    description: 'Tests number sense and quick thinking.',
    badge: 'Math',
    badgeColor: '#B91C1C',
    badgeBg: '#FEE2E2',
    Icon: MathSymbolMinus,
    Character: CartoonDragon,
  },
  {
    id: 'spelling',
    label: 'Spelling',
    tagline: 'Spell it right',
    accent: '#059669',
    accentLight: '#ECFDF5',
    description: 'Hear the clue, pick the correct spelling. Words get tricky!',
    badge: 'Language',
    badgeColor: '#065F46',
    badgeBg: '#D1FAE5',
    Icon: ToyBook,
    Character: CartoonOwl,
    featured: true,
  },
  {
    id: 'division',
    label: 'Division',
    tagline: 'Share equally',
    accent: '#D97706',
    accentLight: '#FFFBEB',
    description: 'Builds deep number understanding.',
    badge: 'Math',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
    Icon: MathSymbolDiv,
    Character: CartoonUnicorn,
  },
  {
    id: 'word-scramble',
    label: 'Word Scramble',
    tagline: 'Unscramble the word',
    accent: '#DB2777',
    accentLight: '#FDF2F8',
    description: 'Jumbled letters, one correct word. Who unscrambles fastest?',
    badge: 'Language',
    badgeColor: '#9D174D',
    badgeBg: '#FCE7F3',
    Icon: ToyMagnifier,
    Character: CartoonUnicorn,
  },
  {
    id: 'general-knowledge',
    label: 'General Knowledge',
    tagline: 'Know it all',
    accent: '#0891B2',
    accentLight: '#ECFEFF',
    description: 'Science, nature, geography and more.',
    badge: 'Knowledge',
    badgeColor: '#0E7490',
    badgeBg: '#CFFAFE',
    Icon: ToyLightbulb,
    Character: CartoonRobot,
  },
  {
    id: 'memory-match',
    label: 'Brain Patterns',
    tagline: 'Spot the pattern',
    accent: '#EA580C',
    accentLight: '#FFF7ED',
    description: 'Number sequences, logic puzzles. Think fast!',
    badge: 'Brain',
    badgeColor: '#C2410C',
    badgeBg: '#FFEDD5',
    Icon: ToyBrain,
    Character: CartoonDragon,
  },
];

export default function GameModesSection() {
  const featured = modes.filter((m) => m.featured);
  const regular = modes.filter((m) => !m.featured);

  return (
    <section
      className="py-24 px-8 lg:px-16 xl:px-20"
      style={{ background: '#FAFAF8' }}
    >
      <div className="max-w-screen-2xl mx-auto">

        {/* Section header — left-aligned, editorial */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: '#0D9488' }} />
              <span
                className="text-xs font-700 tracking-widest uppercase"
                style={{ color: '#0D9488', letterSpacing: '0.15em' }}
              >
                Game Modes
              </span>
            </div>
            <h2
              className="font-800 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#0D1F1A' }}
            >
              Pick Your Battle
            </h2>
          </div>
          <Link
            href="/game-setup-screen"
            className="hidden lg:inline-flex items-center gap-2 font-600 text-sm transition-colors"
            style={{ color: '#6B7280' }}
          >
            Browse all
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {/* Featured cards — tall, span 2 rows */}
          {featured.map((mode) => (
            <Link
              key={`featured-${mode.id}`}
              href={`/game-setup-screen?topic=${mode.id}`}
              className="group relative rounded-3xl overflow-hidden lg:row-span-2 flex flex-col"
              style={{
                background: mode.accentLight,
                border: `1px solid ${mode.accent}20`,
                minHeight: '360px',
              }}
            >
              {/* Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span
                  className="text-xs font-700 px-3 py-1.5 rounded-full"
                  style={{ background: mode.badgeBg, color: mode.badgeColor }}
                >
                  {mode.badge}
                </span>
              </div>

              {/* Character — large, prominent */}
              <div className="flex-1 flex items-end justify-center pt-16 pb-0 overflow-hidden">
                <mode.Character
                  className="w-40 h-40 drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content block */}
              <div className="p-6 pt-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: mode.accent }}
                >
                  <mode.Icon className="w-5 h-5 text-white" />
                </div>
                <h3
                  className="text-xl font-800 mb-1 leading-tight"
                  style={{ color: '#0D1F1A' }}
                >
                  {mode.label}
                </h3>
                <p className="text-sm font-500 mb-1" style={{ color: mode.accent }}>{mode.tagline}</p>
                <p className="text-sm font-400 leading-relaxed" style={{ color: '#6B7280' }}>
                  {mode.description}
                </p>

                {/* Arrow CTA */}
                <div
                  className="mt-5 flex items-center gap-2 text-sm font-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ color: mode.accent }}
                >
                  Play now
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {/* Regular cards — compact */}
          {regular.map((mode) => (
            <Link
              key={`mode-${mode.id}`}
              href={`/game-setup-screen?topic=${mode.id}`}
              className="group relative rounded-3xl overflow-hidden flex flex-col p-5"
              style={{
                background: '#FFFFFF',
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                minHeight: '160px',
                transition: 'box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${mode.accent}22, 0 4px 12px rgba(0,0,0,0.06)`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-auto">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: mode.accentLight }}
                >
                  <mode.Icon className="w-5 h-5" style={{ color: mode.accent } as React.CSSProperties} />
                </div>
                <span
                  className="text-xs font-700 px-2.5 py-1 rounded-full"
                  style={{ background: mode.badgeBg, color: mode.badgeColor }}
                >
                  {mode.badge}
                </span>
              </div>

              {/* Text */}
              <div className="mt-4">
                <h3 className="text-base font-800 mb-0.5" style={{ color: '#0D1F1A' }}>{mode.label}</h3>
                <p className="text-xs font-500 mb-2" style={{ color: mode.accent }}>{mode.tagline}</p>
                <p className="text-xs font-400 leading-relaxed" style={{ color: '#9CA3AF' }}>
                  {mode.description}
                </p>
              </div>

              {/* Hover character peek */}
              <div
                className="absolute -bottom-4 -right-4 w-16 h-16 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              >
                <mode.Character className="w-full h-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}