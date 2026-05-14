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
  accent: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
}

const modes: GameMode[] = [
  {
    id: 'multiplication',
    label: 'Multiply',
    accent: '#0D9488',
    description: 'Fast-paced times tables rounds for confident recall.',
    Icon: MathSymbolTimes,
  },
  {
    id: 'addition',
    label: 'Addition',
    accent: '#2563EB',
    description: 'Quick-fire sums that build speed and accuracy.',
    Icon: MathSymbolPlus,
  },
  {
    id: 'subtraction',
    label: 'Subtraction',
    accent: '#DC2626',
    description: 'Sharper mental subtraction for steady game flow.',
    Icon: MathSymbolMinus,
  },
  {
    id: 'spelling',
    label: 'Spelling',
    accent: '#059669',
    description: 'Short word challenges with clear, simple scoring.',
    Icon: ToyBook,
  },
  {
    id: 'division',
    label: 'Division',
    accent: '#D97706',
    description: 'Practice dividing evenly with calm, focused rounds.',
    Icon: MathSymbolDiv,
  },
  {
    id: 'word-scramble',
    label: 'Word Scramble',
    accent: '#DB2777',
    description: 'A neat vocabulary race with one correct answer.',
    Icon: ToyMagnifier,
  },
  {
    id: 'general-knowledge',
    label: 'General Knowledge',
    accent: '#0891B2',
    description: 'Broad trivia rounds for mixed-age groups.',
    Icon: ToyLightbulb,
  },
  {
    id: 'memory-match',
    label: 'Brain Patterns',
    accent: '#EA580C',
    description: 'Sequence and logic puzzles that reward pattern spotting.',
    Icon: ToyBrain,
  },
];

export default function GameModesSection() {
  return (
    <section
      className="relative overflow-hidden py-24 px-8 lg:px-16 xl:px-20"
      style={{ background: 'linear-gradient(180deg, #FAFAF8 0%, #F6F8F7 100%)' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.25), transparent)' }}
      />

      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-14">
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
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#0D1F1A' }}
            >
              Choose a mode
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: '#6B7280' }}>
              Each mode is tuned for quick rounds, clear scoring, and minimal setup.
            </p>
          </div>
          <Link
            href="/game-setup-screen"
            className="inline-flex items-center gap-2 font-600 text-sm transition-colors"
            style={{ color: '#374151' }}
          >
            Start setup
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/game-setup-screen?topic=${mode.id}`}
              className="group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: '#FFFFFF',
                borderColor: `${mode.accent}18`,
                boxShadow: '0 2px 16px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: mode.accent }}
              />

              {mode.id === 'multiplication' && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="text-xs font-700 px-3 py-1.5 rounded-full"
                    style={{ background: '#FFFBF0', color: mode.accent, border: `1px solid ${mode.accent}33` }}
                  >
                    Pair Extraordinaire
                  </span>
                </div>
              )}

              {/* testing */}

              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mode.accent}12` }}
                >
                  <mode.Icon className="w-5 h-5" style={{ color: mode.accent } as React.CSSProperties} />
                </div>
                <span
                  className="text-xs font-700 px-2.5 py-1 rounded-full"
                  style={{ background: `${mode.accent}10`, color: mode.accent }}
                >
                  Quick play
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-800 leading-tight" style={{ color: '#0D1F1A' }}>{mode.label}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {mode.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-700" style={{ color: mode.accent }}>
                Choose mode
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}