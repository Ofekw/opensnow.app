import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { DailyMetrics } from '@/types';
import { cmToIn } from '@/utils/weather';
import { format, parseISO } from 'date-fns';

interface Props {
  daily: DailyMetrics[];
}

export function DailyForecastChart({ daily }: Props) {
  const data = daily.map((d) => ({
    date: format(parseISO(d.date), 'EEE M/d'),
    snow: +cmToIn(d.snowfallSum).toFixed(1),
    rain: +(d.rainSum / 25.4).toFixed(2),
    high: Math.round(d.temperatureMax * 9 / 5 + 32),
    low: Math.round(d.temperatureMin * 9 / 5 + 32),
    feelsHigh: Math.round(d.apparentTemperatureMax * 9 / 5 + 32),
    feelsLow: Math.round(d.apparentTemperatureMin * 9 / 5 + 32),
    uv: d.uvIndexMax,
  }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            yAxisId="precip"
            orientation="left"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            label={{ value: 'in', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            yAxisId="temp"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            label={{ value: '°F', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              borderColor: '#475569',
              borderRadius: 8,
              color: '#f1f5f9',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          <Bar yAxisId="precip" dataKey="snow" name="Snow (in)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="precip" dataKey="rain" name="Rain (in)" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Line yAxisId="temp" type="monotone" dataKey="high" name="High °F" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line yAxisId="temp" type="monotone" dataKey="low" name="Low °F" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line yAxisId="temp" type="monotone" dataKey="feelsHigh" name="Feels High" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" dot={false} />
          <Line yAxisId="temp" type="monotone" dataKey="feelsLow" name="Feels Low" stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
