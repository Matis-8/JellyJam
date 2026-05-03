'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    id: 'step-setup',
    number: '01',
    title: 'Teacher Sets Up the Game',
    tag: 'Before the Battle',
    accent: '#0D1F1A',
    details: [
      { label: 'Open MathArena', body: 'Launch on a classroom projector or shared screen.' },
      { label: 'Start a Game', body: 'Click "Start a Game" from the home page.' },
      { label: 'Pick a Topic', body: 'Choose Addition, Subtraction, Multiplication, or Division.' },
      { label: 'Set Difficulty', body: 'Easy (1 to 10), Medium (2 to 25), or Hard (5 to 50).' },
      { label: 'Configure Rounds', body: 'Select 5, 10, 15, or 20 questions and 10s, 20s, or 30s per question.' },
      { label: 'Name the Teams', body: 'Enter custom names for Team A (left) and Team B (right).' },
      { label: 'Begin', body: 'Click "Begin Game" to launch the countdown.' },
    ],
  },
  {
    id: 'step-countdown',
    number: '02',
    title: 'Countdown Begins',
    tag: 'Get Ready',
    accent: '#0D9488',
    details: [
      { label: '3-2-1 Screen', body: 'A full-screen countdown appears for both teams.' },
      { label: 'Team Preview', body: 'Team names and the selected topic are shown on both sides.' },
      { label: 'Focus Time', body: 'Both teams get a moment to prepare before the first question.' },
      { label: 'Auto-Advance', body: 'No button press needed. The countdown moves on its own.' },
      { label: 'GO!', body: 'The game arena loads immediately after the countdown ends.' },
    ],
  },
  {
    id: 'step-play',
    number: '03',
    title: 'Teams Answer Simultaneously',
    tag: 'Live Battle',
    accent: '#DC2626',
    details: [
      { label: 'Same Question', body: 'Both teams see the same math question at the same time.' },
      { label: 'Split Screen', body: 'Team A answers on the left. Team B answers on the right.' },
      { label: 'Four Choices', body: 'Each team picks from 4 multiple-choice options. Tap or click.' },
      { label: 'Independent', body: 'Neither team waits for the other. Both answer at their own pace.' },
      { label: 'Timer', body: 'A circular timer counts down. If time runs out, the round scores with no answer.' },
      { label: 'Reveal', body: 'After both teams answer (or time expires), the correct answer flashes on screen.' },
      { label: 'Points', body: 'Each correct answer earns 10 points. Wrong answers earn 0.' },
      { label: 'Streak Badge', body: 'A badge appears if a team gets 2 or more correct in a row.' },
    ],
  },
  {
    id: 'step-results',
    number: '04',
    title: 'See the Final Results',
    tag: 'After the Game',
    accent: '#D97706',
    details: [
      { label: 'Winner', body: 'The results screen shows the winning team with a trophy.' },
      { label: 'Stats', body: 'Final scores, accuracy percentages, and total correct answers are displayed.' },
      { label: 'Chart', body: 'A bar chart shows how each team performed round by round.' },
      { label: 'Breakdown', body: 'A full question-by-question breakdown shows every answer from both teams.' },
      { label: 'Play Again', body: 'Click "Play Again" to replay with the same settings, or "New Game Setup" to change topics.' },
    ],
  },
];

const scoringRules = [
  { id: 'rule-correct', label: 'Correct answer', points: '+10 points', color: 'var(--success)', bg: 'var(--success-light)' },
  { id: 'rule-wrong', label: 'Wrong answer', points: '0 points', color: 'var(--danger)', bg: 'var(--danger-light)' },
  { id: 'rule-timeout', label: 'No answer (timeout)', points: '0 points', color: 'var(--muted-foreground)', bg: 'var(--muted)' },
  { id: 'rule-streak', label: 'Streak bonus (2+ correct in a row)', points: 'Badge displayed', color: 'var(--warning)', bg: 'var(--warning-light)' },
];

const difficulty = [
  { level: 'Easy', range: '1 to 10', grade: 'Grade 1 to 2', color: '#16A34A', bg: '#F0FDF4' },
  { level: 'Medium', range: '2 to 25', grade: 'Grade 3 to 4', color: '#D97706', bg: '#FFFBEB' },
  { level: 'Hard', range: '5 to 50', grade: 'Grade 5 to 6', color: '#DC2626', bg: '#FEF2F2' },
];

export default function HowToPlayContent() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #CCFBF1 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FEF3C7 0%, transparent 70%)', transform: 'translateX(-40%)' }} />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>

        {/* Page header */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pt-14 pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-700 tracking-widest uppercase text-[#0D9488] mb-3">Game Guide</p>
              <h1 className="text-5xl md:text-6xl font-800 text-[#0D1F1A] leading-none tracking-tight">
                How to<br />
                <span className="text-[#0D9488]">Play</span>
              </h1>
            </div>
            <p className="text-base text-[#6B7280] font-500 max-w-sm leading-relaxed md:text-right">
              Four steps. No login required. Open MathArena, set it up, and your class is competing in under two minutes.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="h-px bg-[#E5E7EB]" />
        </div>

        {/* Steps */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-14">
          <div className="grid grid-cols-1 gap-0 divide-y divide-[#E5E7EB]">
            {steps?.map((step) => {
              const isOpen = activeStep === step?.id;
              return (
                <div key={step?.id} className="py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left: step meta */}
                    <div className="lg:col-span-3 flex lg:flex-col gap-4 lg:gap-3">
                      <span
                        className="text-7xl font-800 leading-none select-none"
                        style={{ color: `${step?.accent}18` }}
                      >
                        {step?.number}
                      </span>
                      <div className="flex flex-col justify-center lg:justify-start gap-1">
                        <span
                          className="text-xs font-700 tracking-widest uppercase"
                          style={{ color: step?.accent }}
                        >
                          {step?.tag}
                        </span>
                        <h2 className="text-xl font-700 text-[#0D1F1A] leading-snug">{step?.title}</h2>
                      </div>
                    </div>

                    {/* Right: detail rows */}
                    <div className="lg:col-span-9">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step?.details?.map((item, di) => (
                          <div
                            key={`${step?.id}-d-${di}`}
                            className="flex items-start gap-3 bg-white rounded-xl border border-[#E5E7EB] px-4 py-3"
                            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                          >
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-800 text-white"
                              style={{ background: step?.accent }}
                            >
                              {di + 1}
                            </span>
                            <div>
                              <span className="text-xs font-700 text-[#0D1F1A] block leading-tight">{item?.label}</span>
                              <span className="text-xs text-[#6B7280] font-500 leading-relaxed">{item?.body}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick reference strip */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Scoring */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <h3 className="text-lg font-700 text-[#0D1F1A] mb-5 flex items-center gap-2">
                <Icon name="StarIcon" size={20} variant="solid" className="text-yellow-400" />
                Scoring Rules
              </h3>
              <div className="flex flex-col gap-3">
                {scoringRules?.map((rule) => (
                  <div
                    key={rule?.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: rule?.bg }}
                  >
                    <span className="text-sm font-600" style={{ color: rule?.color }}>{rule?.label}</span>
                    <span className="text-sm font-800" style={{ color: rule?.color }}>{rule?.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <p className="text-xs font-700 tracking-widest uppercase text-[#6B7280] mb-5">Difficulty Levels</p>
              <div className="flex flex-col gap-3">
                {difficulty?.map((d) => (
                  <div
                    key={d?.level}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: d?.bg }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-800 px-2.5 py-0.5 rounded-full text-white"
                        style={{ background: d?.color }}
                      >
                        {d?.level}
                      </span>
                      <span className="text-sm font-600 text-[#0D1F1A]">Numbers {d?.range}</span>
                    </div>
                    <span className="text-xs font-600 text-[#6B7280]">{d?.grade}</span>
                  </div>
                ))}
                <p className="text-[11px] text-[#9CA3AF] font-500 mt-1 px-1">
                  Multiplication always uses tables 1 to 12 regardless of difficulty.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-2xl card-shadow-lg border border-border p-10">
          <h2 className="text-2xl font-700 text-foreground mb-2">Ready to Start?</h2>
          <p className="text-muted-foreground font-500 mb-6">No login, no setup time. Just open MathArena and begin.</p>
          <Link
            href="/game-setup-screen"
            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 active:scale-95 text-white font-700 px-8 py-4 rounded-2xl text-base transition-all duration-200 card-shadow"
          >
            <Icon name="PlayIcon" size={18} variant="solid" />
            Set Up a Game Now
          </Link>
        </div>

      </div>
    </div>
  );
}