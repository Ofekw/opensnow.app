import { describe, it, expect } from 'bun:test';
import { RESORTS, getResortBySlug, searchResorts } from '@/data/resorts';

describe('resorts data', () => {
  describe('RESORTS', () => {
    it('contains at least 30 resorts', () => {
      expect(RESORTS.length).toBeGreaterThanOrEqual(30);
    });

    it('every resort has required fields', () => {
      for (const r of RESORTS) {
        expect(r.slug).toBeTruthy();
        expect(r.name).toBeTruthy();
        expect(r.region).toBeTruthy();
        expect(r.country).toBeTruthy();
        expect(r.lat).toBeTypeOf('number');
        expect(r.lon).toBeTypeOf('number');
        expect(r.elevation.base).toBeTypeOf('number');
        expect(r.elevation.mid).toBeTypeOf('number');
        expect(r.elevation.top).toBeTypeOf('number');
        expect(r.verticalDrop).toBeGreaterThan(0);
      }
    });

    it('all slugs are unique', () => {
      const slugs = RESORTS.map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('elevation base <= mid <= top for every resort', () => {
      for (const r of RESORTS) {
        expect(r.elevation.base).toBeLessThanOrEqual(r.elevation.mid);
        expect(r.elevation.mid).toBeLessThanOrEqual(r.elevation.top);
      }
    });
  });

  describe('getResortBySlug', () => {
    it('returns resort by slug', () => {
      const resort = getResortBySlug('vail-co');
      expect(resort).toBeDefined();
      expect(resort!.name).toBe('Vail');
    });

    it('returns undefined for unknown slug', () => {
      expect(getResortBySlug('nonexistent')).toBeUndefined();
    });
  });

  describe('searchResorts', () => {
    it('returns all resorts for empty query', () => {
      expect(searchResorts('')).toEqual(RESORTS);
    });

    it('returns all resorts for whitespace query', () => {
      expect(searchResorts('   ')).toEqual(RESORTS);
    });

    it('filters by resort name', () => {
      const results = searchResorts('Vail');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((r) => r.name === 'Vail')).toBe(true);
    });

    it('filters by region', () => {
      const results = searchResorts('Colorado');
      expect(results.length).toBeGreaterThan(1);
      results.forEach((r) => expect(r.region).toBe('Colorado'));
    });

    it('is case insensitive', () => {
      const upper = searchResorts('VAIL');
      const lower = searchResorts('vail');
      expect(upper).toEqual(lower);
    });

    it('returns empty array for no matches', () => {
      expect(searchResorts('zzzznotaresort')).toEqual([]);
    });

    it('filters by slug', () => {
      const results = searchResorts('vail-co');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });
});
