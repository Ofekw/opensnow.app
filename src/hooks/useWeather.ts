import { useState, useEffect, useCallback } from 'react';
import type { Resort, ResortForecast, HistoricalSnowDay } from '@/types';
import { fetchForecast, fetchHistorical } from '@/data/openmeteo';

/* ── useForecast ─────────────────────────────────── */

interface UseForecastResult {
  forecast: ResortForecast | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useForecast(resort: Resort | undefined): UseForecastResult {
  const [forecast, setForecast] = useState<ResortForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!resort) return;
    setLoading(true);
    setError(null);
    try {
      const [base, mid, top] = await Promise.all([
        fetchForecast(resort.lat, resort.lon, resort.elevation.base, 'base'),
        fetchForecast(resort.lat, resort.lon, resort.elevation.mid, 'mid'),
        fetchForecast(resort.lat, resort.lon, resort.elevation.top, 'top'),
      ]);
      setForecast({
        resort,
        fetchedAt: new Date().toISOString(),
        base,
        mid,
        top,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  }, [resort]);

  useEffect(() => {
    void load();
  }, [load]);

  return { forecast, loading, error, refetch: load };
}

/* ── useHistorical ───────────────────────────────── */

interface UseHistoricalResult {
  data: HistoricalSnowDay[];
  loading: boolean;
  error: string | null;
}

export function useHistorical(
  resort: Resort | undefined,
  startDate: string,
  endDate: string,
): UseHistoricalResult {
  const [data, setData] = useState<HistoricalSnowDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resort) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchHistorical(
      resort.lat,
      resort.lon,
      resort.elevation.mid,
      startDate,
      endDate,
    )
      .then((days) => {
        if (!cancelled) setData(days);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load history');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resort, startDate, endDate]);

  return { data, loading, error };
}
