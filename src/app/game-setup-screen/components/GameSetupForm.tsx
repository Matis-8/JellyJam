'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { MathSymbolPlus, MathSymbolMinus, MathSymbolTimes, MathSymbolDiv, ShieldBadge, ToyBook, ToyBrain, ToyMagnifier, ToyLightbulb, TrophySVG,  } from '@/components/ui/ToyDecorations';
import { generateQuestions, saveGameState, DEFAULT_CONFIG } from '@/lib/gameStore';
import type { Topic, Difficulty, GameConfig } from '@/lib/gameStore';

interface FormValues {
  teamAName: string;
  teamBName: string;
}

const topics: {
  id: Topic;
  label: string;
  symbol: string;
  color: string;
  accentBg: string;
  border: string;
  Icon: React.FC<{ className?: string }>;
  category: string;
  description: string;
}[] = [
  { id: 'addition', label: 'Addition', symbol: '+', color: '#2563EB', accentBg: '#EFF6FF', border: '#BFDBFE', Icon: MathSymbolPlus, category: 'Math', description: 'Add numbers fast' },
  { id: 'subtraction', label: 'Subtraction', symbol: '−', color: '#DC2626', accentBg: '#FEF2F2', border: '#FECACA', Icon: MathSymbolMinus, category: 'Math', description: 'Take away & count' },
  { id: 'multiplication', label: 'Multiply', symbol: '×', color: '#16A34A', accentBg: '#F0FDF4', border: '#BBF7D0', Icon: MathSymbolTimes, category: 'Math', description: 'Times tables battle' },
  { id: 'division', label: 'Division', symbol: '÷', color: '#D97706', accentBg: '#FFFBEB', border: '#FDE68A', Icon: MathSymbolDiv, category: 'Math', description: 'Split and share' },
  { id: 'spelling', label: 'Spelling', symbol: 'Aa', color: '#059669', accentBg: '#ECFDF5', border: '#A7F3D0', Icon: ToyBook, category: 'Language', description: 'Spell it right' },
  { id: 'word-scramble', label: 'Word Scramble', symbol: '?', color: '#DB2777', accentBg: '#FDF2F8', border: '#FBCFE8', Icon: ToyMagnifier, category: 'Language', description: 'Unscramble words' },
  { id: 'general-knowledge', label: 'General Knowledge', symbol: 'GK', color: '#0891B2', accentBg: '#ECFEFF', border: '#A5F3FC', Icon: ToyLightbulb, category: 'Knowledge', description: 'Know everything' },
  { id: 'memory-match', label: 'Brain Patterns', symbol: '∞', color: '#EA580C', accentBg: '#FFF7ED', border: '#FED7AA', Icon: ToyBrain, category: 'Brain', description: 'Pattern power' },
];

const difficulties: { id: Difficulty; label: string; desc: string; color: string; stars: number; badge: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Perfect for beginners', color: '#16A34A', stars: 1, badge: 'Beginner' },
  { id: 'medium', label: 'Medium', desc: 'Some thinking needed', color: '#D97706', stars: 2, badge: 'Intermediate' },
  { id: 'hard', label: 'Hard', desc: 'Fast thinking required', color: '#DC2626', stars: 3, badge: 'Advanced' },
];

const questionCounts = [5, 10, 15, 20];
const timesPerQuestion = [10, 20, 30];

const categoryMeta: Record<string, { color: string; label: string }> = {
  Math: { color: '#2563EB', label: 'Math' },
  Language: { color: '#059669', label: 'Language' },
  Knowledge: { color: '#0891B2', label: 'Knowledge' },
  Brain: { color: '#EA580C', label: 'Brain' },
};

function SectionLabel({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-800 flex-shrink-0 mt-0.5"
        style={{ background: '#0D1F1A', color: 'white' }}
      >
        {step}
      </div>
      <div>
        <h2 className="text-base font-800" style={{ color: '#0D1F1A', letterSpacing: '-0.01em' }}>{title}</h2>
        <p className="text-sm font-400 mt-0.5" style={{ color: '#6B7280' }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${className}`}
      style={{ background: 'white', borderColor: '#E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {children}
    </div>
  );
}

export default function GameSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopic = (searchParams.get('topic') as Topic) || DEFAULT_CONFIG.topic;

  const [selectedTopic, setSelectedTopic] = useState<Topic>(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DEFAULT_CONFIG.difficulty);
  const [questionCount, setQuestionCount] = useState(DEFAULT_CONFIG.questionCount);
  const [timePerQuestion, setTimePerQuestion] = useState(DEFAULT_CONFIG.timePerQuestion);
  const [gameModeOpen, setGameModeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      teamAName: DEFAULT_CONFIG.teamAName,
      teamBName: DEFAULT_CONFIG.teamBName,
    },
  });

  const teamAName = watch('teamAName') || 'Team A';
  const teamBName = watch('teamBName') || 'Team B';

  const onSubmit = (data: FormValues) => {
    const config: GameConfig = {
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      questionCount,
      timePerQuestion,
      teamAName: data.teamAName.trim() || 'Team Alpha',
      teamBName: data.teamBName.trim() || 'Team Beta',
    };

    const questions = generateQuestions(config.topic, config.difficulty, config.questionCount, Date.now() % 9999);

    saveGameState({
      config,
      questions,
      currentRound: 0,
      teamAScore: 0,
      teamBScore: 0,
      teamAStreak: 0,
      teamBStreak: 0,
      rounds: [],
      status: 'countdown',
    });

    router.push('/game-countdown-screen');
  };

  const difficultyInfo = difficulties.find((d) => d.id === selectedDifficulty)!;
  const topicInfo = topics.find((t) => t.id === selectedTopic)!;
  const categories = ['Math', 'Language', 'Knowledge', 'Brain'];
  const estMinutes = Math.ceil((questionCount * (timePerQuestion + 5)) / 60);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-6">

        {/* Left: Config panels */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* ── Game Mode ── */}
          <Card>
            {/* Header row — always visible, click to toggle */}
            <button
              type="button"
              onClick={() => setGameModeOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-4 group"
              aria-expanded={gameModeOpen}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-800 flex-shrink-0 mt-0.5"
                  style={{ background: '#0D1F1A', color: 'white' }}
                >
                  01
                </div>
                <div className="text-left">
                  <h2 className="text-base font-800" style={{ color: '#0D1F1A', letterSpacing: '-0.01em' }}>Choose Game Mode</h2>
                  {!gameModeOpen && (
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-800 text-white"
                        style={{ background: topicInfo.color }}
                      >
                        {topicInfo.symbol}
                      </div>
                      <span className="text-sm font-600" style={{ color: topicInfo.color }}>{topicInfo.label}</span>
                      <span className="text-xs font-400" style={{ color: '#9CA3AF' }}>{topicInfo.description}</span>
                    </div>
                  )}
                  {gameModeOpen && (
                    <p className="text-sm font-400 mt-0.5" style={{ color: '#6B7280' }}>What will both teams compete in today?</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {gameModeOpen ? (
                  /* Close button */
                  <span
                    onClick={(e) => { e.stopPropagation(); setGameModeOpen(false); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-600 transition-colors duration-150 cursor-pointer"
                    style={{ background: '#F3F4F6', color: '#6B7280' }}
                    role="button"
                    aria-label="Collapse game mode selector"
                  >
                    <Icon name="XMarkIcon" size={13} />
                    Close
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-600 transition-colors duration-150"
                    style={{ background: '#F3F4F6', color: '#374151' }}
                  >
                    Change
                    <Icon name="ChevronDownIcon" size={13} />
                  </span>
                )}
              </div>
            </button>

            {/* Expandable content */}
            {gameModeOpen && (
              <div className="flex flex-col gap-6 mt-6 pt-6 border-t" style={{ borderColor: '#F3F4F6' }}>
                {categories.map((cat) => {
                  const catTopics = topics.filter((t) => t.category === cat);
                  const meta = categoryMeta[cat];
                  return (
                    <div key={`cat-${cat}`}>
                      {/* Category label */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-700 uppercase tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
                        <div className="flex-1 h-px" style={{ background: '#F3F4F6' }} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {catTopics.map((topic) => {
                          const isSelected = selectedTopic === topic.id;
                          return (
                            <button
                              key={`topic-${topic.id}`}
                              type="button"
                              onClick={() => { setSelectedTopic(topic.id); setGameModeOpen(false); }}
                              className="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 active:scale-95 group text-left"
                              style={{
                                background: isSelected ? '#0D1F1A' : 'white',
                                borderColor: isSelected ? '#0D1F1A' : '#E5E7EB',
                              }}
                            >
                              {isSelected && (
                                <div
                                  className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                                  style={{ background: 'rgba(255,255,255,0.2)' }}
                                >
                                  <Icon name="CheckIcon" size={9} className="text-white" />
                                </div>
                              )}
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-800 text-white transition-transform duration-150 group-hover:scale-105"
                                style={{ background: isSelected ? 'rgba(255,255,255,0.15)' : topic.color }}
                              >
                                {topic.symbol}
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-700 leading-tight" style={{ color: isSelected ? '#FFFFFF' : '#374151' }}>
                                  {topic.label}
                                </p>
                                <p className="text-xs font-400 mt-0.5 leading-tight" style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>
                                  {topic.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* ── Difficulty ── */}
          <Card>
            <SectionLabel
              step="02"
              title="Difficulty Level"
              subtitle="Sets the challenge for both teams equally"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={`diff-${diff.id}`}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className="relative flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all duration-150 active:scale-95"
                    style={{
                      background: isSelected ? '#0D1F1A' : 'white',
                      borderColor: isSelected ? '#0D1F1A' : '#E5E7EB',
                    }}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={i < diff.stars ? (isSelected ? '#FFFFFF' : diff.color) : (isSelected ? '#FFFFFF30' : '#E5E7EB')}>
                          <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
                        </svg>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-800" style={{ color: isSelected ? '#FFFFFF' : '#0D1F1A' }}>
                          {diff.label}
                        </span>
                        <span
                          className="text-xs font-600 px-2 py-0.5 rounded-full"
                          style={{
                            background: isSelected ? 'rgba(255,255,255,0.15)' : `${diff.color}12`,
                            color: isSelected ? '#FFFFFF' : diff.color,
                          }}
                        >
                          {diff.badge}
                        </span>
                      </div>
                      <p className="text-xs font-400" style={{ color: isSelected ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>{diff.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ── Questions & Timer ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <SectionLabel
                step="03"
                title="Number of Questions"
                subtitle="How many rounds per game?"
              />
              <div className="grid grid-cols-4 gap-2">
                {questionCounts.map((count) => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={`qcount-${count}`}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className="py-4 rounded-xl border-2 text-xl font-800 transition-all duration-150 active:scale-95"
                      style={{
                        background: isSelected ? '#0D1F1A' : 'white',
                        borderColor: isSelected ? '#0D1F1A' : '#E5E7EB',
                        color: isSelected ? 'white' : '#374151',
                      }}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <SectionLabel
                step="04"
                title="Time per Question"
                subtitle="Seconds each team has to answer"
              />
              <div className="grid grid-cols-3 gap-2">
                {timesPerQuestion.map((t) => {
                  const isSelected = timePerQuestion === t;
                  return (
                    <button
                      key={`time-${t}`}
                      type="button"
                      onClick={() => setTimePerQuestion(t)}
                      className="py-4 rounded-xl border-2 text-center transition-all duration-150 active:scale-95"
                      style={{
                        background: isSelected ? '#0D1F1A' : 'white',
                        borderColor: isSelected ? '#0D1F1A' : '#E5E7EB',
                        color: isSelected ? 'white' : '#374151',
                      }}
                    >
                      <span className="block text-xl font-800">{t}</span>
                      <span className="block text-xs font-500 mt-0.5" style={{ opacity: 0.6 }}>sec</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* ── Team Names ── */}
          <Card>
            <SectionLabel
              step="05"
              title="Name Your Teams"
              subtitle="Personalise each side of the arena"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Team A */}
              <div>
                <label className="block text-xs font-700 uppercase tracking-wider mb-2" htmlFor="teamAName" style={{ color: '#6B7280' }}>
                  Left Side — Team A
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                    <ShieldBadge className="w-5 h-6" color="#2563EB" letter="A" />
                  </div>
                  <input
                    id="teamAName"
                    type="text"
                    maxLength={20}
                    {...register('teamAName', {
                      required: 'Team A name is required',
                      maxLength: { value: 20, message: 'Max 20 characters' },
                    })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 text-sm font-600 outline-none transition-all duration-150"
                    style={{
                      borderColor: errors.teamAName ? '#DC2626' : '#E5E7EB',
                      background: '#FAFAFA',
                      color: '#0D1F1A',
                    }}
                    placeholder="e.g. Team Alpha"
                    onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.background = 'white'; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.teamAName ? '#DC2626' : '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
                  />
                </div>
                {errors.teamAName && (
                  <p className="mt-1.5 text-xs font-500" style={{ color: '#DC2626' }}>{errors.teamAName.message}</p>
                )}
              </div>

              {/* Team B */}
              <div>
                <label className="block text-xs font-700 uppercase tracking-wider mb-2" htmlFor="teamBName" style={{ color: '#6B7280' }}>
                  Right Side — Team B
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                    <ShieldBadge className="w-5 h-6" color="#DC2626" letter="B" />
                  </div>
                  <input
                    id="teamBName"
                    type="text"
                    maxLength={20}
                    {...register('teamBName', {
                      required: 'Team B name is required',
                      maxLength: { value: 20, message: 'Max 20 characters' },
                    })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 text-sm font-600 outline-none transition-all duration-150"
                    style={{
                      borderColor: errors.teamBName ? '#DC2626' : '#E5E7EB',
                      background: '#FAFAFA',
                      color: '#0D1F1A',
                    }}
                    placeholder="e.g. Team Beta"
                    onFocus={(e) => { e.target.style.borderColor = '#DC2626'; e.target.style.background = 'white'; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.teamBName ? '#DC2626' : '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
                  />
                </div>
                {errors.teamBName && (
                  <p className="mt-1.5 text-xs font-500" style={{ color: '#DC2626' }}>{errors.teamBName.message}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Summary + CTA */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">

            {/* Summary Card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'white', borderColor: '#E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2">
                  <TrophySVG className="w-5 h-6" color="#D97706" />
                  <span className="text-sm font-800" style={{ color: '#0D1F1A' }}>Game Summary</span>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Selected mode */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: topicInfo.accentBg, border: `1px solid ${topicInfo.border}` }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-800 text-white flex-shrink-0"
                    style={{ background: topicInfo.color }}
                  >
                    {topicInfo.symbol}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 truncate" style={{ color: topicInfo.color }}>{topicInfo.label}</p>
                    <p className="text-xs font-400" style={{ color: '#6B7280' }}>{topicInfo.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Difficulty', value: difficultyInfo.label, color: difficultyInfo.color },
                    { label: 'Questions', value: `${questionCount}`, color: '#0D9488' },
                    { label: 'Time / Q', value: `${timePerQuestion}s`, color: '#374151' },
                    { label: 'Est. Time', value: `~${estMinutes}min`, color: '#374151' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl"
                      style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
                    >
                      <p className="text-base font-800" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs font-500 mt-0.5" style={{ color: '#9CA3AF' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: '#F3F4F6' }} />

                {/* Teams */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 rounded-lg text-center" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <p className="text-xs font-700 truncate" style={{ color: '#2563EB' }}>{teamAName}</p>
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-800 flex-shrink-0"
                    style={{ background: '#0D1F1A', color: 'white' }}
                  >
                    VS
                  </div>
                  <div className="flex-1 p-2.5 rounded-lg text-center" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <p className="text-xs font-700 truncate" style={{ color: '#DC2626' }}>{teamBName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 font-800 py-4 rounded-2xl text-base transition-all duration-150 active:scale-95"
              style={{
                background: '#0D1F1A',
                color: 'white',
                boxShadow: '0 4px 20px rgba(13,31,26,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0D9488';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(13,148,136,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0D1F1A';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(13,31,26,0.25)';
              }}
            >
              <Icon name="PlayIcon" size={20} variant="solid" />
              <span>Begin Battle</span>
            </button>

            <p className="text-center text-xs font-400" style={{ color: '#9CA3AF' }}>
              Both teams see the same questions simultaneously
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}