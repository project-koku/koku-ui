import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from './data';
import { OptimizationsBreakdownConfiguration } from './optimizationsBreakdownConfiguration';

const recommendations = data.data[0].recommendations;

describe('OptimizationsBreakdownConfiguration', () => {
  test('renders current and recommended configuration', () => {
    render(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={recommendations}
      />
    );
    expect(screen.getByRole('heading', { name: 'Current configuration' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recommended configuration' })).toBeInTheDocument();
  });

  test('copies recommended yaml to the clipboard', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: jest.fn() },
    });
    render(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={recommendations}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('renders long term configuration', () => {
    render(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.long_term}
        optimizationType={OptimizationType.cost}
        recommendations={recommendations}
      />
    );
    expect(screen.getByRole('heading', { name: 'Current configuration' })).toBeInTheDocument();
  });

  test('shows an optimized state when all resources are optimized', () => {
    render(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.medium_term}
        optimizationType={OptimizationType.performance}
        recommendations={recommendations}
      />
    );
    expect(screen.queryByRole('heading', { name: 'Recommended configuration' })).not.toBeInTheDocument();
  });

  test('shows warnings when current values are missing', () => {
    render(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={{ current: {}, recommendation_terms: recommendations.recommendation_terms } as any}
      />
    );
    expect(screen.getByRole('heading', { name: 'Current configuration' })).toBeInTheDocument();
  });
});
