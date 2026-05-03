'use client';
import React from 'react';
import Link from 'next/link';
import { CartoonOwl, CartoonRobot, CartoonUnicorn, CartoonDragon } from '@/components/ui/ToyDecorations';

const steps = [
  {
    id: 'step-setup',
    number: '01',
    title: 'Pick Your Game',
    description: 'Choose from 8 game modes — Math, Spelling, Word Scramble, General Knowledge, Brain Patterns and more.',
    accent: '#0D9488',
    Character: CartoonOwl,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'step-countdown',
    number: '02',
    title: 'Countdown Begins',
    description: 'A 3-2-1 countdown gets both teams pumped up. Topic and team names appear on the big screen.',
    accent: '#2563EB',
    Character: CartoonRobot,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'step-battle',
    number: '03',
    title: 'Battle It Out',
    description: 'Both teams see the same question simultaneously. Each team picks their answer on their side.',
    accent: '#DC2626',
    Character: CartoonDragon,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'step-results',
    number: '04',
    title: 'Crown the Winner',
    description: 'After all rounds, the winner is announced with scores, accuracy, and a full question breakdown.',
    accent: '#D97706',
    Character: CartoonUnicorn,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorksPreview() {
  return (
    <section
      className="py-24 px-8 lg:px-16 xl:px-20 relative overflow-hidden"
      style={{ background: '#0D1F1A' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="max-w-screen-2xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: '#0D9488' }} />
              <span
                className="text-xs font-700 tracking-widest uppercase"
                style={{ color: '#0D9488', letterSpacing: '0.15em' }}
              >
                How It Works
              </span>
            </div>
            <h2
              className="font-800 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#FFFFFF' }}
            >
              From setup to winner
              <br />
              <span style={{ color: '#0D9488' }}>in under 10 minutes.</span>
            </h2>
          </div>
          <Link
            href="/how-to-play-screen"
            className="hidden lg:inline-flex items-center gap-2 font-600 text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Full guide
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Steps — horizontal strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="group relative rounded-3xl p-6 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.borderColor = `${step.accent}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {/* Giant background number */}
              <div
                className="absolute -top-4 -right-2 font-800 leading-none pointer-events-none select-none"
                style={{
                  fontSize: '7rem',
                  color: 'rgba(255,255,255,0.04)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {step.number}
              </div>

              {/* Character — subtle */}
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <step.Character className="w-full h-full" />
              </div>

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${step.accent}20`, color: step.accent }}
              >
                {step.icon}
              </div>

              {/* Step number pill */}
              <div
                className="inline-flex items-center gap-1.5 text-xs font-700 px-2.5 py-1 rounded-full mb-3"
                style={{ background: `${step.accent}15`, color: step.accent }}
              >
                Step {idx + 1}
              </div>

              <h3 className="text-base font-700 mb-2" style={{ color: '#FFFFFF' }}>
                {step.title}
              </h3>
              <p className="text-sm font-400 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {step.description}
              </p>

              {/* Connector dot */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden xl:block absolute top-1/2 -right-2.5 w-5 h-5 rounded-full border-2 z-10"
                  style={{
                    background: '#0D1F1A',
                    borderColor: step.accent,
                    transform: 'translateY(-50%)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'rgba(13,148,136,0.1)',
            border: '1px solid rgba(13,148,136,0.2)',
          }}
        >
          <div>
            <p className="text-lg font-700 mb-1" style={{ color: '#FFFFFF' }}>Ready to play?</p>
            <p className="text-sm font-400" style={{ color: 'rgba(255,255,255,0.5)' }}>
              No accounts, no downloads. Just open and play on any big screen.
            </p>
          </div>
          <Link
            href="/game-setup-screen"
            className="flex-shrink-0 inline-flex items-center gap-2.5 font-700 text-sm text-white px-6 py-3.5 rounded-2xl transition-all duration-200 hover:scale-105"
            style={{
              background: '#0D9488',
              boxShadow: '0 4px 20px rgba(13,148,136,0.4)',
            }}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start a Game
          </Link>
        </div>
      </div>
    </section>
  );
}