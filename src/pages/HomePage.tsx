import { useState, useMemo } from 'react';
import { searchResorts, RESORTS } from '@/data/resorts';
import { useFavorites } from '@/hooks/useFavorites';
import { ResortCard } from '@/components/ResortCard';
import './HomePage.css';

export function HomePage() {
  const [query, setQuery] = useState('');
  const { toggle, isFav } = useFavorites();

  const filtered = useMemo(() => searchResorts(query), [query]);

  // Group by region
  const grouped = useMemo(() => {
    const map = new Map<string, typeof RESORTS>();
    for (const r of filtered) {
      const list = map.get(r.region) ?? [];
      list.push(r);
      map.set(r.region, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">
          <span className="home__title-icon">❄️</span> FreeSnow
        </h1>
        <p className="home__subtitle">
          Free &amp; open-source ski resort forecasts for North America
        </p>
        <input
          className="home__search"
          type="search"
          placeholder="Search resorts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search resorts"
        />
      </section>

      {grouped.length === 0 && (
        <p className="home__empty">No resorts match "{query}"</p>
      )}

      {grouped.map(([region, resorts]) => (
        <section key={region} className="home__region">
          <h2 className="home__region-title">{region}</h2>
          <div className="home__grid">
            {resorts.map((r) => (
              <ResortCard
                key={r.slug}
                resort={r}
                isFavorite={isFav(r.slug)}
                onToggleFavorite={() => toggle(r.slug)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
