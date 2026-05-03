import React from 'react';

// 3D-style SVG toy decorations — no emojis

export function ToyBlock({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="40,4 76,22 40,40 4,22" fill="#60A5FA" />
      <polygon points="4,22 40,40 40,76 4,58" fill="#2563EB" />
      <polygon points="76,22 40,40 40,76 76,58" fill="#1D4ED8" />
      <polygon points="40,4 76,22 40,40 4,22" fill="url(#blockTop)" />
      <defs>
        <linearGradient id="blockTop" x1="40" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" />
          <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyStar({ className = '', color = '#F59E0B' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M40 8L48.5 31.5H73.5L53.5 46L61.5 69L40 55L18.5 69L26.5 46L6.5 31.5H31.5L40 8Z" fill={color} />
      <path d="M40 8L48.5 31.5H73.5L53.5 46L61.5 69L40 55L18.5 69L26.5 46L6.5 31.5H31.5L40 8Z" fill="url(#starGrad)" />
      <defs>
        <linearGradient id="starGrad" x1="40" y1="8" x2="40" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" stopOpacity="0.7" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyPencil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="10" width="20" height="70" rx="3" fill="#FCD34D" />
      <rect x="6" y="10" width="20" height="70" rx="3" fill="url(#pencilGrad)" />
      <rect x="6" y="8" width="20" height="12" rx="3" fill="#FCA5A5" />
      <rect x="6" y="76" width="20" height="8" rx="1" fill="#9CA3AF" />
      <path d="M6 84 L16 98 L26 84 Z" fill="#D97706" />
      <path d="M11 84 L16 94 L21 84 Z" fill="#374151" />
      <defs>
        <linearGradient id="pencilGrad" x1="6" y1="10" x2="26" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyRocket({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M30 5 C30 5 50 25 50 55 L50 75 L10 75 L10 55 C10 25 30 5 30 5Z" fill="#60A5FA" />
      <path d="M30 5 C30 5 50 25 50 55 L50 75 L10 75 L10 55 C10 25 30 5 30 5Z" fill="url(#rocketGrad)" />
      <circle cx="30" cy="45" r="9" fill="#DBEAFE" />
      <circle cx="30" cy="45" r="9" stroke="#2563EB" strokeWidth="2" />
      <circle cx="27" cy="42" r="3" fill="white" fillOpacity="0.6" />
      <path d="M10 65 L2 80 L10 75 Z" fill="#1D4ED8" />
      <path d="M50 65 L58 80 L50 75 Z" fill="#1D4ED8" />
      <path d="M20 75 C20 75 25 90 30 88 C35 90 40 75 40 75 Z" fill="#FCD34D" />
      <path d="M24 75 C24 75 27 86 30 84 C33 86 36 75 36 75 Z" fill="#F97316" />
      <defs>
        <linearGradient id="rocketGrad" x1="10" y1="5" x2="50" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyAbacus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="92" height="72" rx="8" fill="#92400E" stroke="#78350F" strokeWidth="2" />
      <rect x="4" y="4" width="92" height="72" rx="8" fill="url(#abacusGrad)" />
      <line x1="50" y1="12" x2="50" y2="68" stroke="#78350F" strokeWidth="2" />
      <circle cx="22" cy="24" r="7" fill="#EF4444" />
      <circle cx="36" cy="24" r="7" fill="#EF4444" />
      <circle cx="65" cy="24" r="7" fill="#F59E0B" />
      <circle cx="79" cy="24" r="7" fill="#F59E0B" />
      <circle cx="22" cy="44" r="7" fill="#16A34A" />
      <circle cx="36" cy="44" r="7" fill="#16A34A" />
      <circle cx="65" cy="44" r="7" fill="#2563EB" />
      <circle cx="79" cy="44" r="7" fill="#2563EB" />
      <circle cx="22" cy="62" r="7" fill="#7C3AED" />
      <circle cx="65" cy="62" r="7" fill="#DB2777" />
      <circle cx="79" cy="62" r="7" fill="#DB2777" />
      <defs>
        <linearGradient id="abacusGrad" x1="4" y1="4" x2="4" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MathSymbolPlus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect x="16" y="4" width="8" height="32" rx="4" fill="#2563EB" fillOpacity="0.2" />
      <rect x="4" y="16" width="32" height="8" rx="4" fill="#2563EB" fillOpacity="0.2" />
    </svg>
  );
}

export function MathSymbolMinus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="16" width="32" height="8" rx="4" fill="#DC2626" fillOpacity="0.2" />
    </svg>
  );
}

export function MathSymbolTimes({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect x="16" y="4" width="8" height="32" rx="4" transform="rotate(45 20 20)" fill="#16A34A" fillOpacity="0.22" />
      <rect x="4" y="16" width="32" height="8" rx="4" transform="rotate(45 20 20)" fill="#16A34A" fillOpacity="0.22" />
    </svg>
  );
}

export function MathSymbolDiv({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <circle cx="20" cy="10" r="4" fill="#F59E0B" fillOpacity="0.35" />
      <rect x="4" y="16" width="32" height="8" rx="4" fill="#F59E0B" fillOpacity="0.25" />
      <circle cx="20" cy="30" r="4" fill="#F59E0B" fillOpacity="0.35" />
    </svg>
  );
}

export function TrophySVG({ className = '', color = '#F59E0B' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" aria-hidden="true">
      <path d="M20 10 H80 V55 C80 75 65 88 50 90 C35 88 20 75 20 55 Z" fill={color} />
      <path d="M20 10 H80 V55 C80 75 65 88 50 90 C35 88 20 75 20 55 Z" fill="url(#trophyGrad)" />
      <path d="M20 18 C5 18 5 40 20 40" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M80 18 C95 18 95 40 80 40" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="43" y="90" width="14" height="18" rx="3" fill="#D97706" />
      <rect x="28" y="106" width="44" height="10" rx="5" fill="#D97706" />
      <path d="M50 30 L53 40 L63 40 L55 46 L58 56 L50 50 L42 56 L45 46 L37 40 L47 40 Z" fill="white" fillOpacity="0.5" />
      <defs>
        <linearGradient id="trophyGrad" x1="20" y1="10" x2="80" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ShieldBadge({ className = '', color = '#2563EB', letter = 'A' }: { className?: string; color?: string; letter?: string }) {
  return (
    <svg viewBox="0 0 80 90" className={className} fill="none" aria-hidden="true">
      <path d="M40 4 L72 16 V44 C72 62 57 78 40 84 C23 78 8 62 8 44 V16 Z" fill={color} />
      <path d="M40 4 L72 16 V44 C72 62 57 78 40 84 C23 78 8 62 8 44 V16 Z" fill="url(#shieldGrad)" />
      <text x="40" y="52" textAnchor="middle" fontSize="28" fontWeight="800" fill="white" fontFamily="sans-serif">{letter}</text>
      <defs>
        <linearGradient id="shieldGrad" x1="8" y1="4" x2="72" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── New cartoon characters ────────────────────────────────────────────────

export function CartoonOwl({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Body */}
      <ellipse cx="50" cy="80" rx="30" ry="35" fill="#7C3AED" />
      <ellipse cx="50" cy="80" rx="30" ry="35" fill="url(#owlBodyGrad)" />
      {/* Belly */}
      <ellipse cx="50" cy="88" rx="18" ry="22" fill="#DDD6FE" />
      {/* Head */}
      <circle cx="50" cy="45" r="28" fill="#7C3AED" />
      <circle cx="50" cy="45" r="28" fill="url(#owlHeadGrad)" />
      {/* Ear tufts */}
      <path d="M28 22 L22 8 L36 18 Z" fill="#5B21B6" />
      <path d="M72 22 L78 8 L64 18 Z" fill="#5B21B6" />
      {/* Eyes */}
      <circle cx="38" cy="42" r="11" fill="white" />
      <circle cx="62" cy="42" r="11" fill="white" />
      <circle cx="38" cy="42" r="7" fill="#1E293B" />
      <circle cx="62" cy="42" r="7" fill="#1E293B" />
      <circle cx="40" cy="40" r="2.5" fill="white" />
      <circle cx="64" cy="40" r="2.5" fill="white" />
      {/* Beak */}
      <path d="M46 52 L50 60 L54 52 Z" fill="#F59E0B" />
      {/* Wings */}
      <ellipse cx="22" cy="82" rx="12" ry="20" fill="#5B21B6" transform="rotate(-15 22 82)" />
      <ellipse cx="78" cy="82" rx="12" ry="20" fill="#5B21B6" transform="rotate(15 78 82)" />
      {/* Feet */}
      <path d="M38 112 L34 118 M38 112 L38 118 M38 112 L42 118" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 112 L58 118 M62 112 L62 118 M62 112 L66 118" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      {/* Graduation cap */}
      <rect x="28" y="18" width="44" height="6" rx="2" fill="#1E293B" />
      <rect x="44" y="12" width="12" height="8" rx="1" fill="#1E293B" />
      <line x1="72" y1="21" x2="80" y2="30" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="80" cy="32" r="3" fill="#F59E0B" />
      <defs>
        <linearGradient id="owlBodyGrad" x1="20" y1="45" x2="80" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="owlHeadGrad" x1="22" y1="17" x2="78" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CartoonRobot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Antenna */}
      <line x1="50" y1="8" x2="50" y2="20" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="6" r="5" fill="#EF4444" />
      {/* Head */}
      <rect x="22" y="20" width="56" height="44" rx="10" fill="#94A3B8" />
      <rect x="22" y="20" width="56" height="44" rx="10" fill="url(#robotHeadGrad)" />
      {/* Eyes */}
      <rect x="30" y="30" width="16" height="12" rx="4" fill="#1E293B" />
      <rect x="54" y="30" width="16" height="12" rx="4" fill="#1E293B" />
      <rect x="33" y="33" width="6" height="6" rx="2" fill="#60A5FA" />
      <rect x="57" y="33" width="6" height="6" rx="2" fill="#60A5FA" />
      {/* Mouth */}
      <rect x="32" y="50" width="36" height="8" rx="4" fill="#1E293B" />
      <rect x="36" y="52" width="6" height="4" rx="2" fill="#4ADE80" />
      <rect x="47" y="52" width="6" height="4" rx="2" fill="#4ADE80" />
      <rect x="58" y="52" width="6" height="4" rx="2" fill="#4ADE80" />
      {/* Neck */}
      <rect x="44" y="64" width="12" height="8" rx="3" fill="#64748B" />
      {/* Body */}
      <rect x="18" y="72" width="64" height="40" rx="10" fill="#64748B" />
      <rect x="18" y="72" width="64" height="40" rx="10" fill="url(#robotBodyGrad)" />
      {/* Chest panel */}
      <rect x="30" y="80" width="40" height="24" rx="6" fill="#475569" />
      <circle cx="40" cy="88" r="5" fill="#F59E0B" />
      <circle cx="60" cy="88" r="5" fill="#EF4444" />
      <rect x="34" y="97" width="32" height="4" rx="2" fill="#94A3B8" />
      {/* Arms */}
      <rect x="4" y="74" width="14" height="32" rx="7" fill="#64748B" />
      <rect x="82" y="74" width="14" height="32" rx="7" fill="#64748B" />
      {/* Hands */}
      <circle cx="11" cy="110" r="7" fill="#94A3B8" />
      <circle cx="89" cy="110" r="7" fill="#94A3B8" />
      <defs>
        <linearGradient id="robotHeadGrad" x1="22" y1="20" x2="78" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="robotBodyGrad" x1="18" y1="72" x2="82" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CartoonUnicorn({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Horn */}
      <path d="M50 4 L44 24 L56 24 Z" fill="#F59E0B" />
      <path d="M50 4 L44 24 L56 24 Z" fill="url(#hornGrad)" />
      {/* Mane */}
      <path d="M28 28 C20 35 18 50 22 60" stroke="#EC4899" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M30 26 C22 33 20 48 24 58" stroke="#A855F7" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="52" cy="38" rx="26" ry="24" fill="#FDE68A" />
      <ellipse cx="52" cy="38" rx="26" ry="24" fill="url(#unicornHeadGrad)" />
      {/* Snout */}
      <ellipse cx="58" cy="52" rx="14" ry="10" fill="#FCA5A5" />
      {/* Nostrils */}
      <circle cx="54" cy="54" r="2" fill="#F87171" />
      <circle cx="62" cy="54" r="2" fill="#F87171" />
      {/* Eye */}
      <circle cx="40" cy="36" r="7" fill="white" />
      <circle cx="40" cy="36" r="5" fill="#1E293B" />
      <circle cx="38" cy="34" r="2" fill="white" />
      {/* Ear */}
      <path d="M68 20 L76 10 L74 24 Z" fill="#FDE68A" />
      <path d="M70 20 L76 12 L73 23 Z" fill="#FCA5A5" />
      {/* Body */}
      <ellipse cx="50" cy="82" rx="28" ry="22" fill="#FDE68A" />
      <ellipse cx="50" cy="82" rx="28" ry="22" fill="url(#unicornBodyGrad)" />
      {/* Legs */}
      <rect x="30" y="96" width="10" height="14" rx="5" fill="#FDE68A" />
      <rect x="44" y="98" width="10" height="12" rx="5" fill="#FDE68A" />
      <rect x="58" y="98" width="10" height="12" rx="5" fill="#FDE68A" />
      <rect x="72" y="96" width="10" height="14" rx="5" fill="#FDE68A" />
      {/* Tail */}
      <path d="M78 76 C90 70 92 85 84 90" stroke="#EC4899" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M78 76 C92 72 94 87 86 92" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Stars on body */}
      <path d="M50 76 L51.5 80.5 L56 80.5 L52.5 83 L54 87.5 L50 85 L46 87.5 L47.5 83 L44 80.5 L48.5 80.5 Z" fill="#F59E0B" fillOpacity="0.6" />
      <defs>
        <linearGradient id="hornGrad" x1="44" y1="4" x2="56" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="unicornHeadGrad" x1="26" y1="14" x2="78" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="unicornBodyGrad" x1="22" y1="60" x2="78" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CartoonDragon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Wings */}
      <path d="M20 50 C5 35 2 20 15 18 C25 16 30 30 28 45 Z" fill="#16A34A" fillOpacity="0.7" />
      <path d="M80 50 C95 35 98 20 85 18 C75 16 70 30 72 45 Z" fill="#16A34A" fillOpacity="0.7" />
      {/* Body */}
      <ellipse cx="50" cy="78" rx="26" ry="28" fill="#16A34A" />
      <ellipse cx="50" cy="78" rx="26" ry="28" fill="url(#dragonBodyGrad)" />
      {/* Belly */}
      <ellipse cx="50" cy="82" rx="16" ry="20" fill="#BBF7D0" />
      {/* Head */}
      <ellipse cx="50" cy="42" rx="24" ry="22" fill="#16A34A" />
      <ellipse cx="50" cy="42" rx="24" ry="22" fill="url(#dragonHeadGrad)" />
      {/* Horns */}
      <path d="M36 24 L30 10 L40 20 Z" fill="#15803D" />
      <path d="M64 24 L70 10 L60 20 Z" fill="#15803D" />
      {/* Eyes */}
      <circle cx="38" cy="38" r="8" fill="#FEF08A" />
      <circle cx="62" cy="38" r="8" fill="#FEF08A" />
      <ellipse cx="38" cy="38" rx="4" ry="6" fill="#1E293B" />
      <ellipse cx="62" cy="38" rx="4" ry="6" fill="#1E293B" />
      <circle cx="37" cy="36" r="2" fill="white" />
      <circle cx="61" cy="36" r="2" fill="white" />
      {/* Snout */}
      <ellipse cx="50" cy="54" rx="12" ry="8" fill="#15803D" />
      {/* Nostrils */}
      <circle cx="46" cy="54" r="2.5" fill="#166534" />
      <circle cx="54" cy="54" r="2.5" fill="#166534" />
      {/* Flame */}
      <path d="M44 60 C40 68 42 74 50 72 C58 74 60 68 56 60 C54 65 50 66 50 66 C50 66 46 65 44 60Z" fill="#F97316" />
      <path d="M47 62 C45 68 47 72 50 71 C53 72 55 68 53 62 C52 66 50 67 50 67 C50 67 48 66 47 62Z" fill="#FCD34D" />
      {/* Tail */}
      <path d="M76 90 C88 88 94 96 88 102 C84 106 78 102 80 96" stroke="#16A34A" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="30" y="100" width="12" height="10" rx="6" fill="#15803D" />
      <rect x="58" y="100" width="12" height="10" rx="6" fill="#15803D" />
      <defs>
        <linearGradient id="dragonBodyGrad" x1="24" y1="50" x2="76" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dragonHeadGrad" x1="26" y1="20" x2="74" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyBook({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Back cover */}
      <rect x="8" y="10" width="74" height="60" rx="6" fill="#DC2626" />
      {/* Pages */}
      <rect x="12" y="14" width="66" height="52" rx="4" fill="#FEF9EE" />
      {/* Spine */}
      <rect x="8" y="10" width="14" height="60" rx="6" fill="#B91C1C" />
      {/* Lines */}
      <line x1="30" y1="28" x2="70" y2="28" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="36" x2="70" y2="36" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="44" x2="70" y2="44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="52" x2="58" y2="52" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {/* Star bookmark */}
      <path d="M65 14 L67 20 L73 20 L68 24 L70 30 L65 26 L60 30 L62 24 L57 20 L63 20 Z" fill="#F59E0B" />
      {/* Highlight */}
      <rect x="12" y="14" width="66" height="52" rx="4" fill="url(#bookGrad)" />
      <defs>
        <linearGradient id="bookGrad" x1="12" y1="14" x2="78" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyBrain({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Left hemisphere */}
      <path d="M50 20 C30 18 10 28 10 50 C10 68 24 78 40 76 L50 74 Z" fill="#EC4899" />
      <path d="M50 20 C30 18 10 28 10 50 C10 68 24 78 40 76 L50 74 Z" fill="url(#brainLeftGrad)" />
      {/* Right hemisphere */}
      <path d="M50 20 C70 18 90 28 90 50 C90 68 76 78 60 76 L50 74 Z" fill="#F472B6" />
      <path d="M50 20 C70 18 90 28 90 50 C90 68 76 78 60 76 L50 74 Z" fill="url(#brainRightGrad)" />
      {/* Center line */}
      <line x1="50" y1="20" x2="50" y2="74" stroke="#BE185D" strokeWidth="2" />
      {/* Folds left */}
      <path d="M20 38 C24 34 28 38 26 44" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 52 C18 48 24 52 22 58" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 64 C26 60 32 64 30 70" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Folds right */}
      <path d="M80 38 C76 34 72 38 74 44" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M86 52 C82 48 76 52 78 58" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M78 64 C74 60 68 64 70 70" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Sparkles */}
      <circle cx="35" cy="25" r="3" fill="#FDE68A" />
      <circle cx="65" cy="25" r="3" fill="#FDE68A" />
      <circle cx="50" cy="15" r="4" fill="#FDE68A" />
      <defs>
        <linearGradient id="brainLeftGrad" x1="10" y1="20" x2="50" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="brainRightGrad" x1="90" y1="20" x2="50" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToyMagnifier({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Handle */}
      <rect x="58" y="58" width="28" height="12" rx="6" transform="rotate(45 58 58)" fill="#92400E" />
      {/* Glass ring */}
      <circle cx="38" cy="38" r="28" fill="none" stroke="#F59E0B" strokeWidth="8" />
      {/* Glass */}
      <circle cx="38" cy="38" r="22" fill="#DBEAFE" fillOpacity="0.6" />
      {/* Reflection */}
      <path d="M26 26 C30 22 36 22 40 26" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Question mark inside */}
      <text x="38" y="46" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2563EB" fontFamily="sans-serif">?</text>
    </svg>
  );
}

export function ToyLightbulb({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Rays */}
      <line x1="40" y1="4" x2="40" y2="12" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <line x1="64" y1="10" x2="58" y2="16" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <line x1="74" y1="32" x2="66" y2="34" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="10" x2="22" y2="16" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="32" x2="14" y2="34" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      {/* Bulb */}
      <path d="M18 40 C18 26 28 16 40 16 C52 16 62 26 62 40 C62 50 56 58 52 62 L52 72 L28 72 L28 62 C24 58 18 50 18 40 Z" fill="#FCD34D" />
      <path d="M18 40 C18 26 28 16 40 16 C52 16 62 26 62 40 C62 50 56 58 52 62 L52 72 L28 72 L28 62 C24 58 18 50 18 40 Z" fill="url(#bulbGrad)" />
      {/* Filament */}
      <path d="M34 50 C34 44 40 42 40 42 C40 42 46 44 46 50" stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Base */}
      <rect x="28" y="72" width="24" height="6" rx="2" fill="#9CA3AF" />
      <rect x="30" y="78" width="20" height="6" rx="2" fill="#6B7280" />
      <rect x="32" y="84" width="16" height="6" rx="2" fill="#9CA3AF" />
      {/* Shine */}
      <path d="M26 32 C28 26 34 22 40 22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      <defs>
        <linearGradient id="bulbGrad" x1="18" y1="16" x2="62" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}