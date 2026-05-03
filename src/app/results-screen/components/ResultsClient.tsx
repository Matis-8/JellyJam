'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, clearGameState } from '@/lib/gameStore';
import type { GameState } from '@/lib/gameStore';
import Icon from '@/components/ui/AppIcon';
import { TrophySVG, ShieldBadge } from '@/components/ui/ToyDecorations';
import ResultsChart from './ResultsChart';
import ConfettiCanvas from './ConfettiCanvas';
import RoundBreakdown from './RoundBreakdown';

function exportCSV(gameState: GameState) {
  const { config, teamAScore, teamBScore, rounds } = gameState;
  const totalRounds = rounds.length;
  const teamACorrect = rounds.filter((r) => r.teamACorrect).length;
  const teamBCorrect = rounds.filter((r) => r.teamBCorrect).length;
  const teamAAccuracy = totalRounds > 0 ? Math.round((teamACorrect / totalRounds) * 100) : 0;
  const teamBAccuracy = totalRounds > 0 ? Math.round((teamBCorrect / totalRounds) * 100) : 0;
  const isDraw = teamAScore === teamBScore;
  const winner = isDraw ? 'Draw' : teamAScore > teamBScore ? config.teamAName : config.teamBName;

  const lines: string[] = [];

  lines.push('JELLY JAM - GAME RESULTS REPORT');
  lines.push('');
  lines.push('GAME SUMMARY');
  lines.push(`Topic,${config.topic}`);
  lines.push(`Difficulty,${config.difficulty}`);
  lines.push(`Total Rounds,${totalRounds}`);
  lines.push(`Winner,${winner}`);
  lines.push('');
  lines.push('TEAM SCORES');
  lines.push(`Team,Score,Correct,Accuracy`);
  lines.push(`${config.teamAName},${teamAScore},${teamACorrect}/${totalRounds},${teamAAccuracy}%`);
  lines.push(`${config.teamBName},${teamBScore},${teamBCorrect}/${totalRounds},${teamBAccuracy}%`);
  lines.push('');
  lines.push('ROUND BY ROUND BREAKDOWN');
  lines.push(`Round,Question,Correct Answer,${config.teamAName} Answer,${config.teamAName} Result,${config.teamBName} Answer,${config.teamBName} Result`);

  rounds.forEach((round, i) => {
    const teamAAnswer = round.teamAAnswer !== null && round.teamAAnswer !== undefined ? String(round.teamAAnswer) : 'No answer';
    const teamBAnswer = round.teamBAnswer !== null && round.teamBAnswer !== undefined ? String(round.teamBAnswer) : 'No answer';
    lines.push(
      `Q${i + 1},"${round.question} = ?",${round.correctAnswer},"${teamAAnswer}",${round.teamACorrect ? 'Correct' : 'Wrong'},"${teamBAnswer}",${round.teamBCorrect ? 'Correct' : 'Wrong'}`
    );
  });

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jellyjam-results-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(gameState: GameState) {
  const { config, teamAScore, teamBScore, rounds } = gameState;
  const totalRounds = rounds.length;
  const teamACorrect = rounds.filter((r) => r.teamACorrect).length;
  const teamBCorrect = rounds.filter((r) => r.teamBCorrect).length;
  const teamAAccuracy = totalRounds > 0 ? Math.round((teamACorrect / totalRounds) * 100) : 0;
  const teamBAccuracy = totalRounds > 0 ? Math.round((teamBCorrect / totalRounds) * 100) : 0;
  const isDraw = teamAScore === teamBScore;
  const winner = isDraw ? 'Draw' : teamAScore > teamBScore ? config.teamAName : config.teamBName;

  const roundRows = rounds
    .map((round, i) => {
      const teamAAnswer = round.teamAAnswer !== null && round.teamAAnswer !== undefined ? String(round.teamAAnswer) : 'No answer';
      const teamBAnswer = round.teamBAnswer !== null && round.teamBAnswer !== undefined ? String(round.teamBAnswer) : 'No answer';
      const aColor = round.teamACorrect ? '#16a34a' : '#dc2626';
      const bColor = round.teamBCorrect ? '#16a34a' : '#dc2626';
      return `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:6px 10px;font-weight:700;color:#6b7280;">Q${i + 1}</td>
          <td style="padding:6px 10px;">${round.question} = ?</td>
          <td style="padding:6px 10px;text-align:center;font-weight:700;">${round.correctAnswer}</td>
          <td style="padding:6px 10px;text-align:center;color:${aColor};font-weight:700;">${teamAAnswer} (${round.teamACorrect ? 'Correct' : 'Wrong'})</td>
          <td style="padding:6px 10px;text-align:center;color:${bColor};font-weight:700;">${teamBAnswer} (${round.teamBCorrect ? 'Correct' : 'Wrong'})</td>
        </tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Jelly Jam Results</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 40px; }
    h1 { color: #0d9488; font-size: 28px; margin-bottom: 4px; }
    h2 { font-size: 16px; color: #374151; margin: 24px 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    td { padding: 6px 10px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
    .card { background: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; }
    .card-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .card-value { font-size: 32px; font-weight: 800; }
    .team-a { color: #0d9488; }
    .team-b { color: #7c3aed; }
    .winner-badge { display:inline-block; background:#0d9488; color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:999px; margin-left:8px; }
    .meta { font-size: 12px; color: #6b7280; margin-bottom: 24px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Jelly Jam</h1>
  <p class="meta">Game Results Report | Topic: ${config.topic} | Difficulty: ${config.difficulty} | Rounds: ${totalRounds}</p>

  <h2>Winner</h2>
  <p style="font-size:20px;font-weight:800;">${winner}${!isDraw ? '<span class="winner-badge">Winner</span>' : ''}</p>

  <h2>Team Scores</h2>
  <div class="summary-grid">
    <div class="card">
      <div class="card-label">${config.teamAName}</div>
      <div class="card-value team-a">${teamAScore}</div>
      <div style="font-size:13px;color:#6b7280;margin-top:6px;">Correct: ${teamACorrect}/${totalRounds} | Accuracy: ${teamAAccuracy}%</div>
    </div>
    <div class="card">
      <div class="card-label">${config.teamBName}</div>
      <div class="card-value team-b">${teamBScore}</div>
      <div style="font-size:13px;color:#6b7280;margin-top:6px;">Correct: ${teamBCorrect}/${totalRounds} | Accuracy: ${teamBAccuracy}%</div>
    </div>
  </div>

  <h2>Round by Round Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Round</th>
        <th>Question</th>
        <th>Answer</th>
        <th>${config.teamAName}</th>
        <th>${config.teamBName}</th>
      </tr>
    </thead>
    <tbody>
      ${roundRows}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
  }
}

export default function ResultsClient() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = loadGameState();
    if (!state || state.status !== 'finished') {
      router.push('/game-setup-screen');
      return;
    }
    setGameState(state);
  }, [router]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Back to Home button */}
        <div className="mb-6">
          <button
            onClick={() => { clearGameState(); router.push('/'); }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-600 text-sm transition-colors duration-200 bg-white hover:bg-secondary border border-border px-4 py-2 rounded-xl card-shadow"
          >
            <Icon name="ArrowLeftIcon" size={16} />
            Back to Home
          </button>
        </div>

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
                {totalRounds} questions answered {isDraw ? 'tied' : `${winnerLetter === 'A' ? teamACorrect : teamBCorrect} correct`}
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

          {/* Download button with dropdown */}
          <div className="relative" ref={downloadMenuRef}>
            <button
              onClick={() => setShowDownloadMenu((v) => !v)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-secondary active:scale-95 text-foreground font-700 px-8 py-4 rounded-2xl text-base transition-all duration-200 card-shadow border border-border"
            >
              <Icon name="ArrowDownTrayIcon" size={18} />
              Download Report
              <Icon name="ChevronDownIcon" size={14} className={`transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            {showDownloadMenu && (
              <div className="absolute bottom-full mb-2 right-0 sm:left-0 bg-white rounded-2xl card-shadow border border-border overflow-hidden z-50 min-w-[180px]">
                <button
                  onClick={() => { exportCSV(gameState); setShowDownloadMenu(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-600 text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon name="TableCellsIcon" size={16} className="text-primary" />
                  Export as CSV
                </button>
                <div className="h-px bg-border mx-3" />
                <button
                  onClick={() => { exportPDF(gameState); setShowDownloadMenu(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-600 text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon name="DocumentTextIcon" size={16} className="text-danger" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}