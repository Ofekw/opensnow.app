import { useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { getResortBySlug } from '@/data/resorts';
import { ResortCard } from '@/components/ResortCard';
import { Link } from 'react-router-dom';
import './FavoritesPage.css';

export function FavoritesPage() {
  const { favorites, toggle, isFav } = useFavorites();

  const resorts = useMemo(
    () =>
      favorites
        .map((f) => getResortBySlug(f.slug))
        .filter((r): r is NonNullable<typeof r> => r != null),
    [favorites],
  );

  return (
    <div className="favorites">
      <h1 className="favorites__title">★ My Favorites</h1>
      {resorts.length === 0 ? (
        <div className="favorites__empty">
          <p>You haven't added any favorites yet.</p>
          <Link to="/">Browse resorts →</Link>
        </div>
      ) : (
        <div className="favorites__grid">
          {resorts.map((r) => (
            <ResortCard
              key={r.slug}
              resort={r}
              isFavorite={isFav(r.slug)}
              onToggleFavorite={() => toggle(r.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
