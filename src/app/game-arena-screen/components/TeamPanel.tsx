'use client';
import React from 'react';
import type { Question } from '@/lib/gameStore';
import Icon from '@/components/ui/AppIcon';

interface TeamPanelProps {
  teamLabel: string;
  teamLetter: string;
  teamColor: string;
  teamBg: string;
  question: Question;
  selectedAnswer: number | string | null;
  phase: 'playing' | 'revealing' | 'finished';
  onAnswer: (answer: number | string) => void;
  side: 'left' | 'right';
}

export default function TeamPanel({
  teamLabel,
  teamLetter,
  teamColor,
  teamBg,
  question,
  selectedAnswer,
  phase,
  onAnswer,
  side,
}: TeamPanelProps) {
  const hasAnswered = selectedAnswer !== null;
  const isRevealing = phase === 'revealing';
  const isStringAnswer = typeof question.answer === 'string';

  const getButtonState = (option: number | string): 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed' => {
    if (!hasAnswered && !isRevealing) return 'idle';
    if (!isRevealing) {
      // Answered but not yet revealing — show selected vs dimmed only
      if (selectedAnswer === option) return 'selected';
      return 'dimmed';
    }
    // Revealing phase — show correct/wrong
    if (option === question.answer) return 'correct';
    if (selectedAnswer === option && option !== question.answer) return 'wrong';
    return 'dimmed';
  };

  const buttonStyles: Record<string, React.CSSProperties> = {
    idle: {
      background: '#FFFFFF',
      borderColor: 'rgba(0,0,0,0.1)',
      color: '#0D1F1A',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    selected: {
      background: 'rgba(13,148,136,0.08)',
      borderColor: '#0D9488',
      color: '#0D9488',
      boxShadow: '0 2px 12px rgba(13,148,136,0.15)',
    },
    correct: {
      background: 'rgba(22,163,74,0.08)',
      borderColor: '#16A34A',
      color: '#15803D',
      boxShadow: '0 2px 12px rgba(22,163,74,0.15)',
    },
    wrong: {
      background: 'rgba(220,38,38,0.06)',
      borderColor: '#DC2626',
      color: '#DC2626',
      boxShadow: 'none',
    },
    dimmed: {
      background: 'rgba(0,0,0,0.02)',
      borderColor: 'rgba(0,0,0,0.05)',
      color: '#D1D5DB',
      boxShadow: 'none',
    },
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 gap-5"
      style={{ background: teamBg }}
    >
      {/* Team header */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-800 text-base"
          style={{ background: teamColor, boxShadow: `0 4px 16px ${teamColor === 'var(--team-a)' ? 'rgba(37,99,235,0.25)' : 'rgba(220,38,38,0.25)'}` }}
        >
          {teamLetter}
        </div>
        <span
          className="font-700 text-sm tracking-wide truncate max-w-[140px] text-center"
          style={{ color: '#374151' }}
        >
          {teamLabel}
        </span>
      </div>

      {/* Answer status pill */}
      <div className="min-h-9 flex items-center justify-center">
        {hasAnswered ? (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-700"
            style={
              isRevealing
                ? selectedAnswer === question.answer
                  ? { background: 'rgba(22,163,74,0.1)', color: '#15803D', border: '1px solid rgba(22,163,74,0.2)' }
                  : { background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }
                : { background: 'rgba(13,148,136,0.08)', color: '#0D9488', border: '1px solid rgba(13,148,136,0.15)' }
            }
          >
            {isRevealing ? (
              selectedAnswer === question.answer ? (
                <>
                  <Icon name="CheckCircleIcon" size={15} variant="solid" />
                  Correct
                </>
              ) : (
                <>
                  <Icon name="XCircleIcon" size={15} variant="solid" />
                  Wrong
                </>
              )
            ) : (
              <>
                <Icon name="CheckIcon" size={14} />
                Answered
              </>
            )}
          </div>
        ) : (
          <p className="text-sm font-500" style={{ color: '#9CA3AF' }}>
            Choose your answer
          </p>
        )}
      </div>

      {/* Answer options */}
      <div className={`grid gap-3 w-full ${isStringAnswer ? 'grid-cols-1 max-w-sm' : 'grid-cols-2 max-w-sm'}`}>
        {question.options.map((option, i) => {
          const state = getButtonState(option);
          const style = buttonStyles[state] ?? buttonStyles.idle;
          const isCorrect = option === question.answer;
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={`${teamLetter}-opt-${question.id}-${i}`}
              onClick={() => onAnswer(option)}
              disabled={hasAnswered || phase !== 'playing'}
              className={`relative rounded-2xl border-2 font-700 font-tabular transition-all duration-200 active:scale-95 disabled:cursor-not-allowed hover:scale-[1.02] ${
                isStringAnswer ? 'py-3 px-4 text-sm text-left' : 'py-4 px-2 text-xl text-center'
              }`}
              style={style}
            >
              {(isRevealing || hasAnswered) && isCorrect && (
                <span className="absolute top-1.5 right-1.5">
                  <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-green-600" />
                </span>
              )}
              {(isRevealing || hasAnswered) && isSelected && !isCorrect && (
                <span className="absolute top-1.5 right-1.5">
                  <Icon name="XCircleIcon" size={14} variant="solid" className="text-red-500" />
                </span>
              )}
              {String(option)}
            </button>
          );
        })}
      </div>

      {/* Waiting indicator */}
      {hasAnswered && !isRevealing && (
        <p className="text-xs font-500 animate-pulse" style={{ color: '#9CA3AF' }}>
          Waiting for {side === 'left' ? 'right' : 'left'} team...
        </p>
      )}
    </div>
  );
}