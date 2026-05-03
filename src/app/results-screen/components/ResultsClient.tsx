'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, clearGameState } from '@/lib/gameStore';
import type { GameState } from '@/lib/gameStore';
import Icon from '@/components/ui/AppIcon';
import { TrophySVG, ShieldBadge } from '@/components/ui/ToyDecorations';
import ResultsChart from './ResultsChart';
import ConfettiCanvas from './ConfettiCanvas';
import RoundBreakdown from './RoundBreakdown';

export default function ResultsClient() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const state = loadGameState();
    if (!state || state.status !== 'finished') {
      router.push('/game-setup-screen');
      return;
    }
    setGameState(state);
  }, [router]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="animate-pulse bg-muted rounded-2xl w-64 h-32" />
      </div>
    );
  }

  const { config, teamAScore, teamBScore, rounds } = gameState;
  const totalRounds = rounds.length;
  const teamACorrect = rounds.filter((r) => r.teamACorrect).length;
  const teamBCorrect = rounds.filter((r) => r.teamBCorrect).length;
  const teamAAccuracy = totalRounds > 0 ? Math.round((teamACorrect / totalRounds) * 100) : 0;
  const teamBAccuracy = totalRounds > 0 ? Math.round((teamBCorrect / totalRounds) * 100) : 0;

  const isDraw = teamAScore === teamBScore;
  const winnerName = teamAScore > teamBScore ? config.teamAName : config.teamBName;
  const winnerColor = teamAScore > teamBScore ? 'var(--team-a)' : 'var(--team-b)';
  const winnerLetter = teamAScore > teamBScore ? 'A' : 'B';

  const handlePlayAgain = () => {
    // Keep config, regenerate questions
    const newState: GameState = {
      ...gameState,
      currentRound: 0,
      teamAScore: 0,
      teamBScore: 0,
      teamAStreak: 0,
      teamBStreak: 0,
      rounds: [],
      status: 'countdown',
    };
    // Backend integration point: create new session with same config
    const { generateQuestions } = require('@/lib/gameStore');
    newState.questions = generateQuestions(config.topic, config.difficulty, config.questionCount, Date.now() % 9999);
    const { saveGameState } = require('@/lib/gameStore');
    saveGameState(newState);
    router.push('/game-countdown-screen');
  };

  const handleNewGame = () => {
    clearGameState();
    router.push('/game-setup-screen');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0FDF9 0%, #ECFDF5 50%, #F0FDF4 100%)' }}>
      {!isDraw && <ConfettiCanvas />}

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-10">
        {/* Winner hero */}
        <div className="text-center mb-10">
          {isDraw ? (
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-warning/20 flex items-center justify-center">
                <Icon name="TrophyIcon" size={48} style={{ color: 'var(--warning)' }} variant="solid" />
              </div>
              <h1 className="text-5xl font-800 text-foreground">It&apos;s a Draw!</h1>
              <p className="text-muted-foreground font-500 text-lg">Both teams scored equally — well played!</p>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <TrophySVG className="w-28 h-32" color={winnerColor} />
              </div>
              <div className="flex items-center gap-3">
                <ShieldBadge className="w-10 h-12" color={winnerColor} letter={winnerLetter} />
                <h1 className="text-5xl font-800" style={{ color: winnerColor }}>
                  {winnerName}
                </h1>
              </div>
              <p className="text-2xl font-700 text-foreground">Wins the Battle!</p>
              <p className="text-muted-foreground font-500">
                {totalRounds} questions answered — {isDraw ? 'tied' : `${winnerLetter === 'A' ? teamACorrect : teamBCorrect} correct`}
              </p>
            </div>
          )}
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team A */}
          <div
            className="rounded-2xl p-6 border-2 card-shadow"
            style={{
              background: 'var(--team-a-light)',
              borderColor: teamAScore >= teamBScore && !isDraw ? 'var(--team-a)' : 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldBadge className="w-10 h-12" color="var(--team-a)" letter="A" />
                <div>
                  <p className="text-sm font-600 text-muted-foreground">{config.teamAName}</p>
                  {teamAScore > teamBScore && !isDraw && (
                    <span className="text-xs font-700 text-white bg-team-a px-2 py-0.5 rounded-full">Winner</span>
                  )}
                </div>
              </div>
              <span className="text-5xl font-800 font-tabular text-team-a">{teamAScore}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Correct', value: `${teamACorrect}/${totalRounds}` },
                { label: 'Accuracy', value: `${teamAAccuracy}%` },
                { label: 'Points', value: teamAScore },
              ].map((stat) => (
                <div key={`stat-a-${stat.label}`} className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-600 mb-1">{stat.label}</p>
                  <p className="text-lg font-800 text-team-a font-tabular">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team B */}
          <div
            className="rounded-2xl p-6 border-2 card-shadow"
            style={{
              background: 'var(--team-b-light)',
              borderColor: teamBScore > teamAScore && !isDraw ? 'var(--team-b)' : 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldBadge className="w-10 h-12" color="var(--team-b)" letter="B" />
                <div>
                  <p className="text-sm font-600 text-muted-foreground">{config.teamBName}</p>
                  {teamBScore > teamAScore && !isDraw && (
                    <span className="text-xs font-700 text-white bg-team-b px-2 py-0.5 rounded-full">Winner</span>
                  )}
                </div>
              </div>
              <span className="text-5xl font-800 font-tabular text-team-b">{teamBScore}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Correct', value: `${teamBCorrect}/${totalRounds}` },
                { label: 'Accuracy', value: `${teamBAccuracy}%` },
                { label: 'Points', value: teamBScore },
              ].map((stat) => (
                <div key={`stat-b-${stat.label}`} className="bg-white/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-600 mb-1">{stat.label}</p>
                  <p className="text-lg font-800 text-team-b font-tabular">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <ResultsChart gameState={gameState} />

        {/* Round breakdown */}
        <RoundBreakdown gameState={gameState} />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handlePlayAgain}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 active:scale-95 text-white font-700 px-8 py-4 rounded-2xl text-base transition-all duration-200 card-shadow"
          >
            <Icon name="ArrowPathIcon" size={18} />
            Play Again (Same Settings)
          </button>
          <button
            onClick={handleNewGame}
            className="flex items-center justify-center gap-2 bg-white hover:bg-secondary active:scale-95 text-foreground font-700 px-8 py-4 rounded-2xl text-base transition-all duration-200 card-shadow border border-border"
          >
            <Icon name="AdjustmentsHorizontalIcon" size={18} />
            New Game Setup
          </button>
        </div>
      </div>
    </div>
  );
}