/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Interval, OptimizationType } from '../../../utils/commonTypes';

import { OptimizationsBreakdownUtilization } from './optimizationsBreakdownUtilization';
import { costOnlyRecommendations, fullRecommendations } from './fixtures/recommendations';

jest.mock('./optimizationsBreakdownChart', () => ({
  OptimizationsBreakdownChart: () => <div data-testid="mock-chart" />,
}));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('OptimizationsBreakdownUtilization', () => {
  test('renders when performance engine exists', () => {
    renderWithIntl(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={fullRecommendations}
      />
    );
    expect(screen.getByText(/CPU utilization/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory utilization/i)).toBeInTheDocument();
  });

  // FLPATH-3292: Kruize may omit the performance engine entirely
  test('renders without crashing when performance engine is missing', () => {
    renderWithIntl(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={costOnlyRecommendations}
      />
    );
    expect(screen.getByText(/CPU utilization/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory utilization/i)).toBeInTheDocument();
  });

  test('renders without crashing when recommendations are undefined', () => {
    renderWithIntl(
      <OptimizationsBreakdownUtilization
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={undefined}
      />
    );
    expect(screen.getByText(/CPU utilization/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory utilization/i)).toBeInTheDocument();
  });
});
