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
  questionNumber?: number;
  totalQuestions?: number;
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
  questionNumber,
  totalQuestions,
}: TeamPanelProps) {
  const hasAnswered = selectedAnswer !== null;
  const isRevealing = phase === 'revealing';
  const isStringAnswer = typeof question.answer === 'string';

  const getButtonState = (option: number | string): 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed' => {
    if (!hasAnswered && !isRevealing) return 'idle';
    if (!isRevealing) {
      if (selectedAnswer === option) return 'selected';
      return 'dimmed';
    }
    // Revealing phase — only show wrong, keep correct hidden
    if (selectedAnswer === option && option !== question.answer) return 'wrong';
    if (selectedAnswer === option) return 'selected';
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
        {questionNumber !== undefined && totalQuestions !== undefined && (
          <span className="text-xs font-600 px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.05)', color: '#6B7280' }}>
            Q {questionNumber} / {totalQuestions}
          </span>
        )}
      </div>

      {/* Question text for this team */}
      <div
        className="w-full max-w-sm rounded-2xl px-5 py-4 text-center"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}
      >
        {question.category && (
          <span
            className="inline-block text-xs font-700 tracking-widest uppercase px-2.5 py-0.5 rounded-full mb-2"
            style={{ background: 'rgba(13,148,136,0.08)', color: '#0D9488', letterSpacing: '0.1em' }}
          >
            {question.category}
          </span>
        )}
        <p
          className="font-800 leading-tight"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#0D1F1A' }}
        >
          {question.text}
        </p>
        {question.hint && (
          <p className="text-xs font-400 mt-2 italic" style={{ color: '#9CA3AF' }}>
            Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Answer status pill */}
      <div className="min-h-9 flex items-center justify-center">
        {hasAnswered ? (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-700"
            style={{ background: 'rgba(13,148,136,0.08)', color: '#0D9488', border: '1px solid rgba(13,148,136,0.15)' }}
          >
            <Icon name="CheckIcon" size={14} />
            Answered
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