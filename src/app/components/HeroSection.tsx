'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CartoonOwl, CartoonRobot, ToyRocket, ToyStar, ToyBlock, MathSymbolPlus, MathSymbolTimes } from '@/components/ui/ToyDecorations';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#FAFAF8'
      }}>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4
        }} />

      {/* Large ambient color blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)',
          top: '-200px',
          right: '-100px'
        }} />

      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          bottom: '0px',
          left: '-100px'
        }} />

      {/* Thin horizontal rule accent */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.3), transparent)' }} />
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 xl:px-20 relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between py-8">
          <div
            className="inline-flex items-center gap-2.5 text-xs font-700 tracking-widest uppercase"
            style={{ color: '#0D9488', letterSpacing: '0.15em' }}>

            <span
              className="w-2 h-2 rounded-full"
              style={{ background: '#0D9488', animation: 'pulseScale 2s ease-in-out infinite' }} />

            No login required
          </div>
          <div className="flex items-center gap-6 text-xs font-600 tracking-wide" style={{ color: '#6B7280' }}>
            <span>8 Game Modes</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>2 Teams</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Instant Play</span>
          </div>
        </div>

        {/* Main hero layout — asymmetric */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-center pt-8 pb-20 xl:pt-12 xl:pb-28">

          {/* Left — editorial text block */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12" style={{ background: '#0D9488' }} />
              <span className="text-sm font-700 tracking-widest uppercase" style={{ color: '#0D9488', letterSpacing: '0.12em' }}>
                Jelly Jam
              </span>
            </div>

            {/* Giant headline — editorial style */}
            <div>
              <h1
                className="font-800 leading-[0.95] tracking-tight"
                style={{
                  fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                  color: '#0D1F1A'
                }}>

                <span className="block">Learn.</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '2px #0D9488',
                    color: 'transparent'
                  }}>

                  Compete.
                </span>
                <span className="block" style={{ color: '#0D9488' }}>Win.</span>
              </h1>
            </div>

            {/* Descriptor */}
            <p
              className="text-xl font-400 leading-relaxed max-w-lg"
              style={{ color: '#4B5563' }}>Two teams. One screen. Eight game modes  Math, Spelling, Word Scrambles, General Knowledge and Brain Patterns. Built for classrooms and game nights.


            </p>

            {/* CTA row */}
            <div className="flex items-center gap-5">
              <Link
                href="/game-setup-screen"
                className="group relative inline-flex items-center gap-3 font-700 text-base text-white px-8 py-4 rounded-2xl overflow-hidden"
                style={{
                  background: '#0D1F1A',
                  boxShadow: '0 4px 24px rgba(13,31,26,0.25)'
                }}>

                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #0D9488, #059669)' }} />

                <span className="relative flex items-center gap-3">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Start a Game
                </span>
              </Link>

              <Link
                href="/how-to-play-screen"
                className="inline-flex items-center gap-2 font-600 text-base transition-colors duration-200"
                style={{ color: '#374151' }}>

                How it works
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Stat strip */}
            <div className="flex items-center gap-8 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
              {[
              { value: '8', label: 'Game Modes' },
              { value: '3', label: 'Difficulty Levels' },
              { value: '2', label: 'Teams' }]?.
              map((stat) =>
              <div key={stat?.label}>
                  <div className="text-3xl font-800 leading-none" style={{ color: '#0D1F1A' }}>{stat?.value}</div>
                  <div className="text-xs font-500 mt-1" style={{ color: '#9CA3AF' }}>{stat?.label}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right — floating game preview card */}
          {mounted &&
          <div className="relative hidden xl:block">
              {/* Stationary toy decorations around card */}
              <div className="absolute -top-10 -left-10 w-16 h-16">
                <ToyBlock className="w-full h-full drop-shadow-lg" />
              </div>
              <div className="absolute -top-6 -right-8 w-12 h-12">
                <ToyStar className="w-full h-full drop-shadow-md" color="#F59E0B" />
              </div>
              <div className="absolute -bottom-8 -left-6 w-10 h-16">
                <ToyRocket className="w-full h-full drop-shadow-lg" />
              </div>
              <div className="absolute top-1/2 -right-10 w-10 h-10">
                <MathSymbolPlus className="w-full h-full" />
              </div>
              <div className="absolute bottom-10 -right-8 w-10 h-10">
                <MathSymbolTimes className="w-full h-full" />
              </div>

              {/* Main card */}
              <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}>

                {/* Card top bar */}
                <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ background: '#0D1F1A', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div
                  className="flex-1 mx-4 rounded-full h-5 flex items-center px-3"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>

                    <span className="text-xs font-500" style={{ color: 'rgba(255,255,255,0.4)' }}>Jelly Jam — Battle Mode</span>
                  </div>
                </div>

                {/* Split screen preview */}
                <div className="flex">
                  {/* Team A */}
                  <div className="flex-1 p-5" style={{ background: '#F0F9FF', borderRight: '1px solid #E0F2FE' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-700" style={{ color: '#1D4ED8' }}>Team Alpha</span>
                      </div>
                      <span className="text-2xl font-800 font-tabular" style={{ color: '#1D4ED8' }}>24</span>
                    </div>
                    <div
                    className="rounded-2xl p-4 mb-3"
                    style={{ background: '#FFFFFF', border: '1px solid #BFDBFE' }}>

                      <p className="text-xs font-500 mb-2" style={{ color: '#93C5FD' }}>Question 4 / 10</p>
                      <p className="text-3xl font-800 text-center py-1" style={{ color: '#0D1F1A' }}>8 × 7 = ?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['48', '56', '63', '54']?.map((opt, i) =>
                    <div
                      key={`pa-${i}`}
                      className="rounded-xl p-2.5 text-center text-sm font-700 border-2 transition-all"
                      style={i === 1 ?
                      { background: '#DCFCE7', borderColor: '#16A34A', color: '#16A34A' } :
                      { background: '#FFFFFF', borderColor: '#BFDBFE', color: '#64748B' }
                      }>

                          {opt}
                        </div>
                    )}
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex-1 p-5" style={{ background: '#FFF5F5' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs font-700" style={{ color: '#DC2626' }}>Team Beta</span>
                      </div>
                      <span className="text-2xl font-800 font-tabular" style={{ color: '#DC2626' }}>18</span>
                    </div>
                    <div
                    className="rounded-2xl p-4 mb-3"
                    style={{ background: '#FFFFFF', border: '1px solid #FECACA' }}>

                      <p className="text-xs font-500 mb-2" style={{ color: '#FCA5A5' }}>Question 4 / 10</p>
                      <p className="text-3xl font-800 text-center py-1" style={{ color: '#0D1F1A' }}>8 × 7 = ?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['48', '56', '63', '54']?.map((opt, i) =>
                    <div
                      key={`pb-${i}`}
                      className="rounded-xl p-2.5 text-center text-sm font-700 border-2 transition-all"
                      style={i === 2 ?
                      { background: '#FEF2F2', borderColor: '#DC2626', color: '#DC2626' } :
                      { background: '#FFFFFF', borderColor: '#FECACA', color: '#64748B' }
                      }>

                          {opt}
                        </div>
                    )}
                    </div>
                  </div>
                </div>

                {/* Timer bar */}
                <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>

                  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 rounded-full h-2" style={{ background: '#F3F4F6' }}>
                    <div
                    className="h-2 rounded-full"
                    style={{ width: '65%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />

                  </div>
                  <span className="text-sm font-700 font-tabular" style={{ color: '#F59E0B' }}>13s</span>
                </div>
              </div>

              {/* Character badges below card */}
              <div className="flex items-end justify-between mt-4 px-4">
                <div
                className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #F3F4F6'
                }}>

                  <CartoonOwl className="w-8 h-8" />
                  <span className="text-xs font-700" style={{ color: '#1D4ED8' }}>Team A</span>
                </div>
                <div
                className="text-xs font-800 px-3 py-1.5 rounded-full"
                style={{ background: '#0D1F1A', color: '#FFFFFF' }}>

                  VS
                </div>
                <div
                className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #F3F4F6'
                }}>

                  <span className="text-xs font-700" style={{ color: '#DC2626' }}>Team B</span>
                  <CartoonRobot className="w-8 h-8" />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      {/* Bottom edge accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.2), transparent)' }} />

    </section>);

}