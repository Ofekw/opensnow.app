import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResortBySlug } from '@/data/resorts';
import { useForecast, useHistorical } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import { ElevationToggle } from '@/components/ElevationToggle';
import { DailyForecastChart } from '@/components/charts/DailyForecastChart';
import { HourlyDetailChart } from '@/components/charts/HourlyDetailChart';
import { FreezingLevelChart } from '@/components/charts/FreezingLevelChart';
import { UVIndexChart } from '@/components/charts/UVIndexChart';
import { SnowHistoryChart } from '@/components/charts/SnowHistoryChart';
import { weatherDescription, fmtTemp, fmtElevation, fmtSnow } from '@/utils/weather';
import { format, subYears } from 'date-fns';
import type { ElevationBand, BandForecast } from '@/types';
import './ResortPage.css';

export function ResortPage() {
  const { slug } = useParams<{ slug: string }>();
  const resort = useMemo(() => getResortBySlug(slug ?? ''), [slug]);
  const { forecast, loading, error, refetch } = useForecast(resort);
  const { toggle, isFav } = useFavorites();
  const [band, setBand] = useState<ElevationBand>('mid');

  // Historical: last 3 winter seasons (roughly)
  const today = new Date();
  const histEnd = format(subYears(today, 0), 'yyyy-03-31');
  const histStart = format(subYears(today, 3), 'yyyy-10-01');
  const { data: histDays, loading: histLoading } = useHistorical(
    resort,
    histStart,
    histEnd,
  );

  if (!resort) {
    return (
      <div className="resort-page__empty">
        <h2>Resort not found</h2>
        <Link to="/">← Back to all resorts</Link>
      </div>
    );
  }

  const bandData: BandForecast | undefined = forecast?.[band];

  return (
    <div className="resort-page">
      {/* Header */}
      <header className="resort-page__header">
        <div>
          <Link to="/" className="resort-page__back">← All Resorts</Link>
          <h1 className="resort-page__name">{resort.name}</h1>
          <p className="resort-page__region">
            {resort.region}, {resort.country}
            {resort.website && (
              <>
                {' · '}
                <a href={resort.website} target="_blank" rel="noopener noreferrer">
                  Website ↗
                </a>
              </>
            )}
          </p>
        </div>
        <button
          className={`resort-page__fav ${isFav(resort.slug) ? 'active' : ''}`}
          onClick={() => toggle(resort.slug)}
          aria-label={isFav(resort.slug) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav(resort.slug) ? '★' : '☆'}
        </button>
      </header>

      {/* Quick stats */}
      <section className="resort-page__stats">
        <div className="stat">
          <span className="stat__label">Base</span>
          <span className="stat__value">{fmtElevation(resort.elevation.base)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Mid</span>
          <span className="stat__value">{fmtElevation(resort.elevation.mid)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Top</span>
          <span className="stat__value">{fmtElevation(resort.elevation.top)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Vertical</span>
          <span className="stat__value">{fmtElevation(resort.verticalDrop)}</span>
        </div>
        {resort.lifts && (
          <div className="stat">
            <span className="stat__label">Lifts</span>
            <span className="stat__value">{resort.lifts}</span>
          </div>
        )}
        {resort.acres && (
          <div className="stat">
            <span className="stat__label">Acres</span>
            <span className="stat__value">{resort.acres.toLocaleString()}</span>
          </div>
        )}
      </section>

      {/* Band toggle */}
      <div className="resort-page__toggle-row">
        <ElevationToggle
          value={band}
          onChange={setBand}
          elevations={resort.elevation}
        />
        <button className="resort-page__refresh" onClick={refetch} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {error && <p className="resort-page__error">⚠️ {error}</p>}

      {loading && !forecast && (
        <div className="resort-page__loader">Loading forecast…</div>
      )}

      {bandData && (
        <>
          {/* Daily summary row */}
          <section className="resort-page__daily-summary">
            <h2 className="section-title">7-Day Forecast — {band.toUpperCase()} ({fmtElevation(bandData.elevation)})</h2>
            <div className="daily-cards">
              {bandData.daily.map((d) => {
                const desc = weatherDescription(d.weatherCode);
                return (
                  <div key={d.date} className="day-card">
                    <span className="day-card__date">
                      {format(new Date(d.date), 'EEE')}
                    </span>
                    <span className="day-card__icon" title={desc.label}>
                      {desc.icon}
                    </span>
                    <span className="day-card__temps">
                      {fmtTemp(d.temperatureMax)} / {fmtTemp(d.temperatureMin)}
                    </span>
                    <span className="day-card__snow">
                      {d.snowfallSum > 0 ? `❄️ ${fmtSnow(d.snowfallSum)}` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Charts */}
          <section className="resort-page__section">
            <h2 className="section-title">Snow &amp; Rain / Temperature</h2>
            <DailyForecastChart daily={bandData.daily} />
          </section>

          <section className="resort-page__section">
            <h2 className="section-title">Hourly Detail (next 7 days)</h2>
            <HourlyDetailChart hourly={bandData.hourly.slice(0, 72)} />
          </section>

          <section className="resort-page__section">
            <h2 className="section-title">UV Index</h2>
            <UVIndexChart daily={bandData.daily} />
          </section>

          <section className="resort-page__section">
            <h2 className="section-title">Freezing Level</h2>
            <FreezingLevelChart hourly={bandData.hourly.slice(0, 72)} />
          </section>
        </>
      )}

      {/* Historical */}
      <section className="resort-page__section">
        <h2 className="section-title">Historical Snowfall (past 3 seasons)</h2>
        {histLoading ? (
          <div className="resort-page__loader">Loading history…</div>
        ) : histDays.length > 0 ? (
          <SnowHistoryChart days={histDays} />
        ) : (
          <p className="resort-page__muted">No historical data available.</p>
        )}
      </section>
    </div>
  );
}
