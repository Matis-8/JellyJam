'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState } from '@/lib/gameStore';
import type { GameState } from '@/lib/gameStore';

const TOPIC_LABELS: Record<string, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  spelling: 'Spelling',
  'word-scramble': 'Word Scramble',
  'general-knowledge': 'General Knowledge',
  'memory-match': 'Brain Patterns',
};
const TOPIC_SYMBOLS: Record<string, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
  spelling: 'Aa',
  'word-scramble': '?',
  'general-knowledge': 'GK',
  'memory-match': '∞',
};
const TOPIC_COLORS: Record<string, string> = {
  addition: '#2563EB',
  subtraction: '#DC2626',
  multiplication: '#16A34A',
  division: '#D97706',
  spelling: '#059669',
  'word-scramble': '#DB2777',
  'general-knowledge': '#0891B2',
  'memory-match': '#EA580C',
};
const DIFF_COLORS: Record<string, string> = {
  easy: '#16A34A',
  medium: '#D97706',
  hard: '#DC2626',
};

export default function CountdownClient() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState<'count' | 'go'>('count');
  const [key, setKey] = useState(0);

  useEffect(() => {
    const state = loadGameState();
    if (!state) {
      router.push('/game-setup-screen');
      return;
    }
    setGameState(state);
  }, [router]);

  // Handle count decrement
  useEffect(() => {
    if (!gameState) return;
    if (phase !== 'count') return;

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((c) => c - 1);
        setKey((k) => k + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // count === 0: switch to GO phase
      setPhase('go');
      setKey((k) => k + 1);
    }
  }, [count, phase, gameState]);

  // Navigate to arena once GO phase starts — separate effect so cleanup doesn't cancel it
  useEffect(() => {
    if (phase !== 'go') return;
    const goTimer = setTimeout(() => {
      router.push('/game-arena-screen');
    }, 900);
    return () => clearTimeout(goTimer);
  }, [phase, router]);

  if (!gameState) return null;

  const { config } = gameState;
  const topicColor = TOPIC_COLORS[config.topic] ?? '#0D9488';
  const diffColor = DIFF_COLORS[config.difficulty] ?? '#0D9488';

  const countColors = ['#2563EB', '#D97706', '#DC2626'];
  const currentCountColor = count > 0 ? countColors[count - 1] ?? '#0D9488' : '#0D9488';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: '#FAFAF8' }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)',
          top: '-200px',
          left: '-150px',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          bottom: '-100px',
          right: '-100px',
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.4), transparent)' }} />

      {/* Back / Close button */}
      <button
        type="button"
        onClick={() => router.push('/game-setup-screen')}
        className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.08)',
          color: '#374151',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.9)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Setup
      </button>

      {/* Team banners — left and right */}
      <div className="absolute top-0 left-0 bottom-0 w-1/4 flex flex-col items-center justify-center gap-3 opacity-70">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-800 text-xl"
          style={{ background: 'var(--team-a)', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}
        >
          A
        </div>
        <p className="font-700 text-sm text-center px-4 max-w-[120px] truncate" style={{ color: '#374151' }}>
          {config.teamAName}
        </p>
      </div>
      <div className="absolute top-0 right-0 bottom-0 w-1/4 flex flex-col items-center justify-center gap-3 opacity-70">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-800 text-xl"
          style={{ background: 'var(--team-b)', boxShadow: '0 8px 24px rgba(220,38,38,0.25)' }}
        >
          B
        </div>
        <p className="font-700 text-sm text-center px-4 max-w-[120px] truncate" style={{ color: '#374151' }}>
          {config.teamBName}
        </p>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Topic + Difficulty + Count badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-700"
            style={{ background: `${topicColor}14`, color: topicColor, border: `1px solid ${topicColor}30` }}
          >
            {TOPIC_SYMBOLS[config.topic]} {TOPIC_LABELS[config.topic]}
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-700 capitalize"
            style={{ background: `${diffColor}14`, color: diffColor, border: `1px solid ${diffColor}30` }}
          >
            {config.difficulty}
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-700"
            style={{ background: 'rgba(0,0,0,0.04)', color: '#6B7280', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {config.questionCount} Questions
          </span>
        </div>

        {/* Countdown number */}
        <div
          key={key}
          className="countdown-pop flex items-center justify-center"
          style={{ width: 180, height: 180 }}
        >
          {phase === 'count' && count > 0 ? (
            <div className="flex flex-col items-center gap-0">
              <span
                className="font-800 font-tabular leading-none"
                style={{
                  fontSize: '9rem',
                  color: currentCountColor,
                  filter: `drop-shadow(0 0 40px ${currentCountColor}44)`,
                }}
              >
                {count}
              </span>
            </div>
          ) : (
            <span
              className="font-800 leading-none"
              style={{
                fontSize: '4.5rem',
                color: '#0D9488',
                filter: 'drop-shadow(0 0 40px rgba(13,148,136,0.35))',
              }}
            >
              GO!
            </span>
          )}
        </div>

        {/* Status label */}
        <p className="text-sm font-600 tracking-wide" style={{ color: '#9CA3AF' }}>
          {phase === 'count' ? 'Get ready...' : 'Starting now!'}
        </p>

        {/* VS row */}
        <div
          className="flex items-center gap-4 px-6 py-3 rounded-2xl"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <span className="font-700 text-sm max-w-[100px] truncate" style={{ color: '#374151' }}>
            {config.teamAName}
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#F3F4F6' }}
          >
            <span className="text-xs font-800" style={{ color: '#9CA3AF' }}>VS</span>
          </div>
          <span className="font-700 text-sm max-w-[100px] truncate" style={{ color: '#374151' }}>
            {config.teamBName}
          </span>
        </div>
      </div>
    </div>
  );
}