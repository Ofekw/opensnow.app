import { describe, it, expect } from 'bun:test';
import { screen } from '@testing-library/react';
import { App } from '@/App';
import { renderWithProviders } from '@/test/test-utils';

describe('App', () => {
  it('renders the home page at /', () => {
    renderWithProviders(<App />, { initialEntries: ['/'] });
    // Search bar should be present on home page
    expect(screen.getByPlaceholderText('Search resorts…')).toBeInTheDocument();
  });

  it('renders footer on every page', () => {
    renderWithProviders(<App />, { initialEntries: ['/'] });
    expect(screen.getByText(/open-meteo/i)).toBeInTheDocument();
  });
});
