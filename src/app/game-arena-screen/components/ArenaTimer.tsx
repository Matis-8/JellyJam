'use client';
import React, { useEffect, useRef } from 'react';

interface ArenaTimerProps {
  duration: number;
  active: boolean;
  onTimeUp: () => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export default function ArenaTimer({ duration, active, onTimeUp, timeLeft, setTimeLeft }: ArenaTimerProps) {
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    hasCalledTimeUp.current = false;
  }, [duration]);

  // Reset hasCalledTimeUp when timer becomes active again (new round)
  useEffect(() => {
    if (active) {
      hasCalledTimeUp.current = false;
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      if (!hasCalledTimeUp.current) {
        hasCalledTimeUp.current = true;
        onTimeUp();
      }
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, timeLeft, onTimeUp, setTimeLeft]);

  const pct = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const strokeColor = isUrgent ? '#DC2626' : isWarning ? '#D97706' : '#0D9488';
  const textColor = isUrgent ? '#DC2626' : '#0D1F1A';

  return (
    <div
      className="relative w-14 h-14 flex items-center justify-center rounded-full"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <svg viewBox="0 0 52 52" className="absolute inset-0 w-full h-full -rotate-90" aria-label={`${timeLeft} seconds remaining`}>
        <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
        <circle
          cx="26"
          cy="26"
          r="22"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <span
        className={`relative text-base font-800 font-tabular ${isUrgent ? 'timer-pulse' : ''}`}
        style={{ color: textColor }}
      >
        {timeLeft}
      </span>
    </div>
  );
}