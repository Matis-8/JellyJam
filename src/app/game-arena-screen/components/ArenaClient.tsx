'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, saveGameState } from '@/lib/gameStore';
import type { GameState, Question } from '@/lib/gameStore';
import Icon from '@/components/ui/AppIcon';
import { ToyBlock, ToyStar, ToyRocket, MathSymbolPlus, MathSymbolTimes, MathSymbolDiv, ToyAbacus } from '@/components/ui/ToyDecorations';
import ArenaTimer from './ArenaTimer';
import TeamPanel from './TeamPanel';

export default function ArenaClient() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<'playing' | 'revealing' | 'finished'>('playing');
  const [teamAAnswer, setTeamAAnswer] = useState<number | string | null>(null);
  const [teamBAnswer, setTeamBAnswer] = useState<number | string | null>(null);
  const [teamAAnswerTime, setTeamAAnswerTime] = useState<number>(0);
  const [teamBAnswerTime, setTeamBAnswerTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [mounted, setMounted] = useState(false);
  const roundStartTime = useRef<number>(Date.now());
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const state = loadGameState();
    if (!state || state.questions.length === 0) {
      router.push('/game-setup-screen');
      return;
    }
    setGameState(state);
    setTimeLeft(state.config.timePerQuestion);
    roundStartTime.current = Date.now();
  }, [router]);

  const currentQuestion: Question | null =
    gameState ? gameState.questions[gameState.currentRound] ?? null : null;

  const advanceRound = useCallback(
    (gs: GameState, aAns: number | string | null, bAns: number | string | null, aTime: number, bTime: number) => {
      const q = gs.questions[gs.currentRound];
      const aCorrect = aAns === q.answer;
      const bCorrect = bAns === q.answer;

      const newAScore = gs.teamAScore + (aCorrect ? 10 : 0);
      const newBScore = gs.teamBScore + (bCorrect ? 10 : 0);
      const newAStreak = aCorrect ? gs.teamAStreak + 1 : 0;
      const newBStreak = bCorrect ? gs.teamBStreak + 1 : 0;

      const newRound: import('@/lib/gameStore').RoundResult = {
        questionId: q.id,
        question: q.text,
        correctAnswer: q.answer,
        teamAAnswer: aAns,
        teamACorrect: aCorrect,
        teamATime: aTime,
        teamBAnswer: bAns,
        teamBCorrect: bCorrect,
        teamBTime: bTime,
      };

      const nextRoundIndex = gs.currentRound + 1;
      const isLastRound = nextRoundIndex >= gs.questions.length;

      const updatedState: GameState = {
        ...gs,
        teamAScore: newAScore,
        teamBScore: newBScore,
        teamAStreak: newAStreak,
        teamBStreak: newBStreak,
        rounds: [...gs.rounds, newRound],
        currentRound: nextRoundIndex,
        status: isLastRound ? 'finished' : 'playing',
      };

      saveGameState(updatedState);
      setPhase('revealing');

      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        if (isLastRound) {
          router.push('/results-screen');
        } else {
          setGameState(updatedState);
          setTeamAAnswer(null);
          setTeamBAnswer(null);
          setTeamAAnswerTime(0);
          setTeamBAnswerTime(0);
          setTimerActive(true);
          setTimeLeft(updatedState.config.timePerQuestion);
          roundStartTime.current = Date.now();
          setPhase('playing');
        }
      }, 2000);
    },
    [router]
  );

  const handleTeamAAnswer = useCallback(
    (answer: number | string) => {
      if (!gameState || teamAAnswer !== null || phase !== 'playing') return;
      const elapsed = Math.round((Date.now() - roundStartTime.current) / 100) / 10;
      setTeamAAnswer(answer);
      setTeamAAnswerTime(elapsed);
      if (teamBAnswer !== null) {
        setTimerActive(false);
        advanceRound(gameState, answer, teamBAnswer, elapsed, teamBAnswerTime);
      }
    },
    [gameState, teamAAnswer, teamBAnswer, phase, teamBAnswerTime, advanceRound]
  );

  const handleTeamBAnswer = useCallback(
    (answer: number | string) => {
      if (!gameState || teamBAnswer !== null || phase !== 'playing') return;
      const elapsed = Math.round((Date.now() - roundStartTime.current) / 100) / 10;
      setTeamBAnswer(answer);
      setTeamBAnswerTime(elapsed);
      if (teamAAnswer !== null) {
        setTimerActive(false);
        advanceRound(gameState, teamAAnswer, answer, teamAAnswerTime, elapsed);
      }
    },
    [gameState, teamAAnswer, teamBAnswer, phase, teamAAnswerTime, advanceRound]
  );

  const handleTimeUp = useCallback(() => {
    if (!gameState || phase !== 'playing') return;
    setTimerActive(false);
    const aTime = teamAAnswer !== null ? teamAAnswerTime : gameState.config.timePerQuestion;
    const bTime = teamBAnswer !== null ? teamBAnswerTime : gameState.config.timePerQuestion;
    advanceRound(gameState, teamAAnswer, teamBAnswer, aTime, bTime);
  }, [gameState, teamAAnswer, teamBAnswer, teamAAnswerTime, teamBAnswerTime, phase, advanceRound]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  if (!gameState || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
        <div className="animate-pulse rounded-2xl w-64 h-32" style={{ background: 'rgba(13,148,136,0.08)' }} />
      </div>
    );
  }

  const { config } = gameState;
  const totalRounds = gameState.questions.length;
  const currentRoundDisplay = gameState.currentRound + 1;
  const progressPct = ((gameState.currentRound) / totalRounds) * 100;

  return (
    <div className="min-h-screen flex flex-col select-none relative overflow-hidden" style={{ background: '#FAFAF8' }}>

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
      <div
        className="absolute pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      {/* Floating toy decorations */}
      {mounted && (
        <>
          <div className="absolute pointer-events-none toy-float" style={{ top: '12%', left: '2%', width: '48px', height: '48px', animationDelay: '0s' }}>
            <ToyBlock className="w-full h-full opacity-40" />
          </div>
          <div className="absolute pointer-events-none toy-float-delay" style={{ top: '25%', right: '1.5%', width: '40px', height: '40px' }}>
            <ToyStar className="w-full h-full opacity-35" color="#F59E0B" />
          </div>
          <div className="absolute pointer-events-none toy-float-slow" style={{ bottom: '20%', left: '1.5%', width: '36px', height: '60px' }}>
            <ToyRocket className="w-full h-full opacity-30" />
          </div>
          <div className="absolute pointer-events-none toy-float" style={{ bottom: '30%', right: '2%', width: '44px', height: '44px', animationDelay: '1.2s' }}>
            <ToyAbacus className="w-full h-full opacity-25" />
          </div>
          <div className="absolute pointer-events-none toy-float-delay" style={{ top: '60%', left: '1%', width: '32px', height: '32px' }}>
            <MathSymbolPlus className="w-full h-full opacity-20" />
          </div>
          <div className="absolute pointer-events-none toy-float-slow" style={{ top: '70%', right: '1%', width: '32px', height: '32px' }}>
            <MathSymbolTimes className="w-full h-full opacity-20" />
          </div>
          <div className="absolute pointer-events-none toy-float" style={{ top: '45%', right: '1%', width: '28px', height: '28px', animationDelay: '0.6s' }}>
            <MathSymbolDiv className="w-full h-full opacity-20" />
          </div>
        </>
      )}

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.4), transparent)' }} />

      {/* Header bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        {/* Team A score */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-800 text-sm flex-shrink-0"
            style={{ background: 'var(--team-a)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
          >
            A
          </div>
          <div>
            <p className="text-xs font-600 tracking-wide uppercase" style={{ color: '#9CA3AF', letterSpacing: '0.08em' }}>
              {config.teamAName}
            </p>
            <p className="text-3xl font-800 leading-none font-tabular" style={{ color: '#0D1F1A' }}>
              {gameState.teamAScore}
            </p>
          </div>
          {gameState.teamAStreak >= 2 && (
            <div
              className="flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Icon name="FireIcon" size={12} variant="solid" />
              {gameState.teamAStreak}x
            </div>
          )}
        </div>

        {/* Center: round info + timer */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-px w-8" style={{ background: 'rgba(13,148,136,0.3)' }} />
            <p className="text-xs font-700 tracking-widest uppercase" style={{ color: '#6B7280', letterSpacing: '0.12em' }}>
              Round {currentRoundDisplay} / {totalRounds}
            </p>
            <div className="h-px w-8" style={{ background: 'rgba(13,148,136,0.3)' }} />
          </div>
          <ArenaTimer
            duration={config.timePerQuestion}
            active={timerActive}
            onTimeUp={handleTimeUp}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
          />
        </div>

        {/* Team B score */}
        <div className="flex items-center gap-3 flex-row-reverse min-w-[160px]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-800 text-sm flex-shrink-0"
            style={{ background: 'var(--team-b)', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}
          >
            B
          </div>
          <div className="text-right">
            <p className="text-xs font-600 tracking-wide uppercase" style={{ color: '#9CA3AF', letterSpacing: '0.08em' }}>
              {config.teamBName}
            </p>
            <p className="text-3xl font-800 leading-none font-tabular" style={{ color: '#0D1F1A' }}>
              {gameState.teamBScore}
            </p>
          </div>
          {gameState.teamBStreak >= 2 && (
            <div
              className="flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Icon name="FireIcon" size={12} variant="solid" />
              {gameState.teamBStreak}x
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div
          className="h-0.5 transition-all duration-700"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #0D9488, #059669)' }}
        />
      </div>

      {/* Question card */}
      <div className="relative z-10 flex items-center justify-center px-6 lg:px-12 py-6 lg:py-8">
        <div
          className="w-full max-w-3xl rounded-3xl px-8 lg:px-12 py-6 lg:py-8 text-center"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            {currentQuestion.category && (
              <>
                <span
                  className="text-xs font-700 tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(13,148,136,0.08)', color: '#0D9488', letterSpacing: '0.1em' }}
                >
                  {currentQuestion.category}
                </span>
                <span className="w-1 h-1 rounded-full" style={{ background: '#D1D5DB' }} />
              </>
            )}
            <span className="text-xs font-600 tracking-wide" style={{ color: '#9CA3AF' }}>
              Question {currentRoundDisplay}
            </span>
          </div>

          <p
            className="font-800 leading-tight"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#0D1F1A',
            }}
          >
            {currentQuestion.text}
          </p>

          {currentQuestion.hint && (
            <p className="text-sm font-400 mt-3 italic" style={{ color: '#9CA3AF' }}>
              Hint: {currentQuestion.hint}
            </p>
          )}
        </div>
      </div>

      {/* Split arena */}
      <div className="relative z-10 flex flex-1">
        <TeamPanel
          teamLabel={config.teamAName}
          teamLetter="A"
          teamColor="var(--team-a)"
          teamBg="rgba(37,99,235,0.04)"
          question={currentQuestion}
          selectedAnswer={teamAAnswer}
          phase={phase}
          onAnswer={handleTeamAAnswer}
          side="left"
        />

        {/* VS divider */}
        <div
          className="flex-shrink-0 flex items-center justify-center relative"
          style={{ width: '1px', background: 'rgba(0,0,0,0.06)' }}
        >
          <div
            className="absolute flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <span className="text-xs font-800" style={{ color: '#9CA3AF' }}>VS</span>
          </div>
        </div>

        <TeamPanel
          teamLabel={config.teamBName}
          teamLetter="B"
          teamColor="var(--team-b)"
          teamBg="rgba(220,38,38,0.04)"
          question={currentQuestion}
          selectedAnswer={teamBAnswer}
          phase={phase}
          onAnswer={handleTeamBAnswer}
          side="right"
        />
      </div>
    </div>
  );
}