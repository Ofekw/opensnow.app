import { Link } from 'react-router-dom';
import type { Resort } from '@/types';
import { fmtElevation } from '@/utils/weather';
import './ResortCard.css';

interface Props {
  resort: Resort;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ResortCard({ resort, isFavorite, onToggleFavorite }: Props) {
  return (
    <div className="resort-card">
      <div className="resort-card__header">
        <Link to={`/resort/${resort.slug}`} className="resort-card__name">
          {resort.name}
        </Link>
        <button
          className={`resort-card__fav ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <p className="resort-card__region">
        {resort.region}, {resort.country}
      </p>
      <div className="resort-card__stats">
        <span>
          <strong>Base</strong> {fmtElevation(resort.elevation.base)}
        </span>
        <span>
          <strong>Top</strong> {fmtElevation(resort.elevation.top)}
        </span>
        <span>
          <strong>Vert</strong> {fmtElevation(resort.verticalDrop)}
        </span>
        {resort.acres && (
          <span>
            <strong>Acres</strong> {resort.acres.toLocaleString()}
          </span>
        )}
      </div>
      <Link to={`/resort/${resort.slug}`} className="resort-card__cta">
        View Forecast →
      </Link>
    </div>
  );
}
