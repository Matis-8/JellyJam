import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import GameSetupForm from './components/GameSetupForm';

function GameSetupContent() {
  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '100px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Page Header */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-14 pb-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs font-600 uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Home</span>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span className="text-xs font-600 uppercase tracking-widest" style={{ color: '#374151' }}>Set Up the Arena</span>
          </div>

          {/* Title block */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 rounded-full" style={{ background: '#0D9488' }} />
                <span className="text-sm font-700 uppercase tracking-widest" style={{ color: '#0D9488' }}>Configure Your Battle</span>
              </div>
              <h1 className="font-800 leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0D1F1A', letterSpacing: '-0.03em' }}>
                Set Up the{' '}
                <span style={{ color: '#0D9488' }}>Arena</span>
              </h1>
              <p className="mt-3 text-base font-400 max-w-md" style={{ color: '#6B7280', lineHeight: 1.6 }}>
                Pick a game mode, set the difficulty, name your teams — then let the battle begin.
              </p>
            </div>

            {/* Team badges */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border" style={{ background: 'white', borderColor: '#E5E7EB' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#2563EB' }} />
                <span className="text-sm font-700" style={{ color: '#374151' }}>Team A</span>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-800" style={{ background: '#0D1F1A', color: 'white' }}>
                VS
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border" style={{ background: 'white', borderColor: '#E5E7EB' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
                <span className="text-sm font-700" style={{ color: '#374151' }}>Team B</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px" style={{ background: 'linear-gradient(90deg, #E5E7EB 0%, transparent 100%)' }} />
        </div>
      </div>

      {/* Form area */}
      <div className="relative px-6 lg:px-10 pb-20" style={{ zIndex: 1 }}>
        <div className="max-w-screen-xl mx-auto">
          <GameSetupForm />
        </div>
      </div>
    </div>
  );
}

export default function GameSetupPage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent mx-auto mb-3 animate-spin" style={{ borderColor: '#0D9488', borderTopColor: 'transparent' }} />
            <p className="text-sm font-600" style={{ color: '#6B7280' }}>Loading...</p>
          </div>
        </div>
      }>
        <GameSetupContent />
      </Suspense>
    </AppLayout>
  );
}