'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { GameState } from '@/lib/gameStore';

const BarChart = dynamic(() => import('recharts').then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((m) => m.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false });

interface Props {
  gameState: GameState;
}

export default function ResultsChart({ gameState }: Props) {
  const { rounds, config } = gameState;

  const data = rounds.map((r, i) => ({
    name: `Q${i + 1}`,
    [config.teamAName]: r.teamACorrect ? 10 : 0,
    [config.teamBName]: r.teamBCorrect ? 10 : 0,
  }));

  return (
    <div className="bg-white rounded-2xl card-shadow border border-border p-6 mb-6">
      <h3 className="text-base font-700 text-foreground mb-4">Points Per Round</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--muted-foreground)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[0, 10]} ticks={[0, 10]} />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
            <Bar dataKey={config.teamAName} fill="var(--team-a)" radius={[6, 6, 0, 0]} />
            <Bar dataKey={config.teamBName} fill="var(--team-b)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}