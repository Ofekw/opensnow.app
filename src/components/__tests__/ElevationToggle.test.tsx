import { describe, it, expect, mock } from 'bun:test';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ElevationToggle } from '@/components/ElevationToggle';
import { renderWithProviders } from '@/test/test-utils';

const elevations = { base: 2475, mid: 3050, top: 3527 };

describe('ElevationToggle', () => {
  it('renders three band buttons', () => {
    const onChange = mock(() => {});
    renderWithProviders(
      <ElevationToggle value="mid" onChange={onChange} elevations={elevations} />,
    );

    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('Mid')).toBeInTheDocument();
    expect(screen.getByText('Top')).toBeInTheDocument();
  });

  it('marks the active band as checked', () => {
    const onChange = mock(() => {});
    renderWithProviders(
      <ElevationToggle value="mid" onChange={onChange} elevations={elevations} />,
    );

    const midBtn = screen.getByRole('radio', { name: /mid/i });
    expect(midBtn).toHaveAttribute('aria-checked', 'true');

    const baseBtn = screen.getByRole('radio', { name: /base/i });
    expect(baseBtn).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange when a different band is clicked', async () => {
    const user = userEvent.setup();
    const onChange = mock(() => {});
    renderWithProviders(
      <ElevationToggle value="mid" onChange={onChange} elevations={elevations} />,
    );

    await user.click(screen.getByText('Top'));
    expect(onChange).toHaveBeenCalledWith('top');
  });

  it('displays elevations in feet by default (imperial)', () => {
    const onChange = mock(() => {});
    renderWithProviders(
      <ElevationToggle value="base" onChange={onChange} elevations={elevations} />,
    );

    // Base: 2475m ≈ 8,120ft
    expect(screen.getByText('8,120ft')).toBeInTheDocument();
  });

  it('has radiogroup role', () => {
    const onChange = mock(() => {});
    renderWithProviders(
      <ElevationToggle value="mid" onChange={onChange} elevations={elevations} />,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});
