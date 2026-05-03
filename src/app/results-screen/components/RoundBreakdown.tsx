'use client';
import React from 'react';
import type { GameState } from '@/lib/gameStore';
import Icon from '@/components/ui/AppIcon';

interface Props {
  gameState: GameState;
}

export default function RoundBreakdown({ gameState }: Props) {
  const { rounds, config } = gameState;

  return (
    <div className="bg-white rounded-2xl card-shadow border border-border p-6">
      <h3 className="text-base font-700 text-foreground mb-4 flex items-center gap-2">
        <Icon name="ListBulletIcon" size={18} className="text-primary" />
        Round-by-Round Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs font-700 text-muted-foreground uppercase tracking-wider">Round</th>
              <th className="text-left py-2 px-3 text-xs font-700 text-muted-foreground uppercase tracking-wider">Question</th>
              <th className="text-center py-2 px-3 text-xs font-700 text-muted-foreground uppercase tracking-wider">Answer</th>
              <th className="text-center py-2 px-3 text-xs font-700 text-muted-foreground uppercase tracking-wider">{config.teamAName}</th>
              <th className="text-center py-2 px-3 text-xs font-700 text-muted-foreground uppercase tracking-wider">{config.teamBName}</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, i) => (
              <tr
                key={`round-row-${round.questionId}`}
                className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
              >
                <td className="py-3 px-3 font-700 text-muted-foreground font-tabular">Q{i + 1}</td>
                <td className="py-3 px-3 font-700 text-foreground font-tabular">{round.question} = ?</td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-block bg-primary/10 text-primary font-800 px-2 py-0.5 rounded-lg font-tabular">
                    {round.correctAnswer}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="inline-block font-700 px-2 py-0.5 rounded-lg font-tabular text-sm"
                      style={{
                        background: round.teamACorrect ? 'var(--success-light)' : 'var(--danger-light)',
                        color: round.teamACorrect ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {round.teamAAnswer ?? '—'}
                    </span>
                    {round.teamACorrect ? (
                      <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-success" />
                    ) : (
                      <Icon name="XCircleIcon" size={14} variant="solid" className="text-danger" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="inline-block font-700 px-2 py-0.5 rounded-lg font-tabular text-sm"
                      style={{
                        background: round.teamBCorrect ? 'var(--success-light)' : 'var(--danger-light)',
                        color: round.teamBCorrect ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {round.teamBAnswer ?? '—'}
                    </span>
                    {round.teamBCorrect ? (
                      <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-success" />
                    ) : (
                      <Icon name="XCircleIcon" size={14} variant="solid" className="text-danger" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}