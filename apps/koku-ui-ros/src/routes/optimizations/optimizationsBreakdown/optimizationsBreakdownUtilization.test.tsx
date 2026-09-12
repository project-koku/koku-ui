import { render, screen } from '@testing-library/react';
import React from 'react';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from './data';
import { OptimizationsBreakdownUtilization } from './optimizationsBreakdownUtilization';

jest.mock('./optimizationsBreakdownChart', () => ({
  OptimizationsBreakdownChart: ({ name, usageData }: { name?: string; usageData?: unknown[] }) => (
    <div data-testid={name}>{usageData?.length || 0}</div>
  ),
}));

const recommendations = data.data[0].recommendations;

describe('OptimizationsBreakdownUtilization', () => {
  test('renders cpu and memory charts from plot data', () => {
    render(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={recommendations}
      />
    );
    expect(screen.getByRole('heading', { name: 'CPU utilization' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Memory utilization' })).toBeInTheDocument();
    expect(Number(screen.getByTestId('utilization-cpuUsage').textContent)).toBeGreaterThan(0);
  });

  test('pads short-term dates when plots are missing', () => {
    render(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={{ monitoring_end_time: '2024-01-21T00:00:00.000Z' } as any}
      />
    );
    expect(Number(screen.getByTestId('utilization-cpuUsage').textContent)).toBe(4);
  });

  test('pads medium-term dates when plots are missing', () => {
    render(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.medium_term}
        optimizationType={OptimizationType.performance}
        recommendations={{ monitoring_end_time: '2024-01-21T00:00:00.000Z' } as any}
      />
    );
    expect(Number(screen.getByTestId('utilization-cpuUsage').textContent)).toBe(7);
  });

  test('pads long-term dates when plots are missing', () => {
    render(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.long_term}
        optimizationType={OptimizationType.cost}
        recommendations={{ monitoring_end_time: '2024-01-21T00:00:00.000Z' } as any}
      />
    );
    expect(Number(screen.getByTestId('utilization-cpuUsage').textContent)).toBe(15);
  });
});
