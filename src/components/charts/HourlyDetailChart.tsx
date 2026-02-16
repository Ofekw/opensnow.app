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
import type { HourlyMetrics } from '@/types';
import { cmToIn } from '@/utils/weather';
import { format, parseISO } from 'date-fns';

interface Props {
  hourly: HourlyMetrics[];
}

export function HourlyDetailChart({ hourly }: Props) {
  const data = hourly.map((h) => ({
    time: format(parseISO(h.time), 'EEE ha'),
    snow: +cmToIn(h.snowfall).toFixed(2),
    rain: +(h.rain / 25.4).toFixed(2),
    temp: Math.round(h.temperature * 9 / 5 + 32),
    feels: Math.round(h.apparentTemperature * 9 / 5 + 32),
    wind: Math.round(h.windSpeed * 0.621371),
    gusts: Math.round(h.windGusts * 0.621371),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval="preserveStartEnd"
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            yAxisId="precip"
            orientation="left"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            yAxisId="temp"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#475569' }}
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
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="precip" dataKey="snow" name="Snow (in)" fill="#38bdf8" radius={[3, 3, 0, 0]} />
          <Bar yAxisId="precip" dataKey="rain" name="Rain (in)" fill="#6366f1" radius={[3, 3, 0, 0]} />
          <Line yAxisId="temp" type="monotone" dataKey="temp" name="Temp °F" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line yAxisId="temp" type="monotone" dataKey="feels" name="Feels °F" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
