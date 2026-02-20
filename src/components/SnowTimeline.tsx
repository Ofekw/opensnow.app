/**
 * SnowTimeline — At-a-glance past + future snowfall bar.
 *
 * Inspired by OpenSnow's snow summary: shows past 7 days + upcoming 7 days
 * as a compact horizontal bar chart with a vertical "today" divider.
 * Gives powder hunters an instant read on the snow trend.
 */
import { useMemo } from 'react';
import type { DailyMetrics } from '@/types';
import { useUnits } from '@/context/UnitsContext';
import { useTimezone } from '@/context/TimezoneContext';
import { fmtSnow, cmToIn } from '@/utils/weather';
import './SnowTimeline.css';

interface Props {
  /** Past days (up to 7, chronological order oldest→newest) */
  recentDays: DailyMetrics[];
  /** Forecast days (up to 7, chronological order) */
  forecastDays: DailyMetrics[];
}

export function SnowTimeline({ recentDays, forecastDays }: Props) {
  const { snow } = useUnits();
  const { fmtDate } = useTimezone();
  const isImperial = snow === 'in';

  const { pastBars, todayBar, futureBars, maxSnow, pastTotal, futureTotal } = useMemo(() => {
    // Take last 7 past days
    const past = recentDays.slice(-7);
    // First forecast day is today; the rest are future
    const [todayDay, ...rest] = forecastDays;
    const future = rest.slice(0, 7);

    const toDisplay = (cm: number) =>
      isImperial ? +cmToIn(cm).toFixed(1) : +cm.toFixed(1);

    const pastBars = past.map((d) => ({
      date: d.date,
      snow: toDisplay(d.snowfallSum),
      raw: d.snowfallSum,
    }));

    const todayBar = todayDay
      ? { date: todayDay.date, snow: toDisplay(todayDay.snowfallSum), raw: todayDay.snowfallSum }
      : null;

    const futureBars = future.map((d) => ({
      date: d.date,
      snow: toDisplay(d.snowfallSum),
      raw: d.snowfallSum,
    }));

    const allSnow = [...pastBars, ...(todayBar ? [todayBar] : []), ...futureBars].map((b) => b.snow);
    const maxSnow = Math.max(...allSnow, 0.1); // avoid 0 max

    const pastTotal = past.reduce((s, d) => s + d.snowfallSum, 0);
    const futureTotal =
      (todayDay ? todayDay.snowfallSum : 0) + future.reduce((s, d) => s + d.snowfallSum, 0);

    return { pastBars, todayBar, futureBars, maxSnow, pastTotal, futureTotal };
  }, [recentDays, forecastDays, isImperial]);

  const fmtDay = (dateStr: string) =>
    fmtDate(dateStr + 'T12:00:00', { weekday: 'short' });

  const fmtFull = (dateStr: string) =>
    fmtDate(dateStr + 'T12:00:00', { weekday: 'short', month: 'short', day: 'numeric' });

  const unit = isImperial ? '"' : 'cm';

  return (
    <div className="snow-timeline" role="figure" aria-label="Snow timeline showing past and upcoming snowfall">
      {/* Header */}
      <div className="snow-timeline__header">
        <div className="snow-timeline__totals">
          <span className="snow-timeline__total snow-timeline__total--past">
            <span className="snow-timeline__total-label">Past 7d</span>
            <span className="snow-timeline__total-value">{fmtSnow(pastTotal, snow)}</span>
          </span>
          <span className="snow-timeline__total snow-timeline__total--future">
            <span className="snow-timeline__total-label">Next 7d</span>
            <span className="snow-timeline__total-value">{fmtSnow(futureTotal, snow)}</span>
          </span>
        </div>
      </div>

      {/* Bar chart area */}
      <div className="snow-timeline__chart">
        {/* Past bars */}
        <div className="snow-timeline__section snow-timeline__section--past">
          {pastBars.map((bar) => {
            const pct = (bar.snow / maxSnow) * 100;
            return (
              <div
                key={bar.date}
                className="snow-timeline__bar-col"
                title={`${fmtFull(bar.date)}: ${bar.snow}${unit}`}
              >
                <span className="snow-timeline__bar-value">
                  {bar.snow > 0 ? `${bar.snow}` : ''}
                </span>
                <div className="snow-timeline__bar-track">
                  <div
                    className="snow-timeline__bar snow-timeline__bar--past"
                    style={{ height: `${Math.max(pct, bar.snow > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="snow-timeline__bar-label">{fmtDay(bar.date)}</span>
              </div>
            );
          })}
        </div>

        {/* Today bar */}
        <div className="snow-timeline__today" aria-label="Today">
          <span className="snow-timeline__bar-value snow-timeline__bar-value--today">
            {todayBar && todayBar.snow > 0 ? `${todayBar.snow}` : ''}
          </span>
          <div className="snow-timeline__bar-track">
            {todayBar ? (
              <div
                className="snow-timeline__bar snow-timeline__bar--today"
                style={{
                  height: `${Math.max((todayBar.snow / maxSnow) * 100, todayBar.snow > 0 ? 4 : 0)}%`,
                }}
              />
            ) : (
              <div className="snow-timeline__divider-line" />
            )}
          </div>
          <span className="snow-timeline__divider-label">Today</span>
        </div>

        {/* Future bars */}
        <div className="snow-timeline__section snow-timeline__section--future">
          {futureBars.map((bar) => {
            const pct = (bar.snow / maxSnow) * 100;
            return (
              <div
                key={bar.date}
                className="snow-timeline__bar-col"
                title={`${fmtFull(bar.date)}: ${bar.snow}${unit}`}
              >
                <span className="snow-timeline__bar-value">
                  {bar.snow > 0 ? `${bar.snow}` : ''}
                </span>
                <div className="snow-timeline__bar-track">
                  <div
                    className="snow-timeline__bar snow-timeline__bar--future"
                    style={{ height: `${Math.max(pct, bar.snow > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="snow-timeline__bar-label">{fmtDay(bar.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
