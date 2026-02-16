import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { HistoricalSnowDay } from '@/types';
import { cmToIn } from '@/utils/weather';

interface Props {
  days: HistoricalSnowDay[];
}

export function SnowHistoryChart({ days }: Props) {
  // Aggregate by month
  const byMonth = new Map<string, { snowfall: number; snowDepth: number; count: number }>();

  for (const d of days) {
    const key = d.date.slice(0, 7); // YYYY-MM
    const entry = byMonth.get(key) ?? { snowfall: 0, snowDepth: 0, count: 0 };
    entry.snowfall += d.snowfall;
    entry.snowDepth += d.snowDepth;
    entry.count += 1;
    byMonth.set(key, entry);
  }

  const data = [...byMonth.entries()].map(([month, v]) => ({
    month,
    snowfall: +cmToIn(v.snowfall).toFixed(1),
    avgDepth: +cmToIn(v.snowDepth / v.count).toFixed(1),
  }));

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#475569' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#475569' }} />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              borderColor: '#475569',
              borderRadius: 8,
              color: '#f1f5f9',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="snowfall" name="Snowfall (in)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="avgDepth" name="Avg Depth (in)" fill="#818cf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
