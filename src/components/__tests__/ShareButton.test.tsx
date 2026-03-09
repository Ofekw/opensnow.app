import { describe, it, expect, mock, afterAll } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { ShareButton } from '@/components/ShareButton';
import type { ShareCardData } from '@/utils/shareCard';

// Mock shareCard utils to avoid Canvas in tests
mock.module('@/utils/shareCard', () => ({
  renderShareCard: mock(() => {
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 420;
    return c;
  }),
  shareCardToBlob: mock(() => Promise.resolve(new Blob(['png'], { type: 'image/png' }))),
}));

afterAll(() => {
  mock.restore();
});

function makeCardData(): ShareCardData {
  return {
    resort: {
      slug: 'vail-co',
      name: 'Vail',
      region: 'Colorado',
      country: 'US',
      lat: 39.6403,
      lon: -106.3742,
      elevation: { base: 2475, mid: 3050, top: 3527 },
      verticalDrop: 1052,
    },
    daily: [
      {
        date: '2025-01-15',
        weatherCode: 73,
        temperatureMax: -2,
        temperatureMin: -10,
        apparentTemperatureMax: -5,
        apparentTemperatureMin: -15,
        uvIndexMax: 3,
        precipitationSum: 5,
        rainSum: 0,
        snowfallSum: 8,
        precipitationProbabilityMax: 80,
        windSpeedMax: 20,
        windGustsMax: 35,
      },
    ],
    band: 'mid',
    elevation: 3050,
    weekTotalSnow: 8,
    snowUnit: 'in',
    tempUnit: 'F',
    elevUnit: 'ft',
  };
}

describe('ShareButton', () => {
  it('renders a share button', () => {
    render(<ShareButton cardData={makeCardData()} />);
    const btn = screen.getByRole('button', { name: /share forecast/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('shows "Share" label', () => {
    render(<ShareButton cardData={makeCardData()} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('is disabled when cardData is null', () => {
    render(<ShareButton cardData={null} />);
    const btn = screen.getByRole('button', { name: /share forecast/i });
    expect(btn).toBeDisabled();
  });
});
