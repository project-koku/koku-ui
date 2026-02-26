/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Interval, OptimizationType } from '../../../utils/commonTypes';

import { OptimizationsBreakdownConfiguration } from './optimizationsBreakdownConfiguration';
import { costOnlyRecommendations, fullRecommendations } from './fixtures/recommendations';

jest.mock('routes/components/state/optimizedState', () => ({
  OptimizedState: () => <div data-testid="optimized-state" />,
}));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('OptimizationsBreakdownConfiguration', () => {
  test('shows recommended code block when performance engine exists', () => {
    renderWithIntl(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={fullRecommendations}
      />
    );
    expect(screen.getByText('Current configuration')).toBeInTheDocument();
    expect(screen.getByText('Recommended configuration')).toBeInTheDocument();
    expect(screen.queryByText(/No recommendations available/i)).not.toBeInTheDocument();
  });

  // FLPATH-3292: Kruize may omit the performance engine entirely
  test('shows empty state when performance engine is missing', () => {
    renderWithIntl(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={costOnlyRecommendations}
      />
    );
    expect(screen.getByText('Current configuration')).toBeInTheDocument();
    expect(screen.getByText('Recommended configuration')).toBeInTheDocument();
    expect(
      screen.getByText('No recommendations available for the selected optimization type and interval.')
    ).toBeInTheDocument();
  });

  test('shows empty state when recommendations are undefined', () => {
    renderWithIntl(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.performance}
        recommendations={undefined}
      />
    );
    expect(screen.getByText('Recommended configuration')).toBeInTheDocument();
    expect(
      screen.getByText('No recommendations available for the selected optimization type and interval.')
    ).toBeInTheDocument();
  });

  test('shows recommended code block for cost optimization type', () => {
    renderWithIntl(
      <OptimizationsBreakdownConfiguration
        currentInterval={Interval.short_term}
        optimizationType={OptimizationType.cost}
        recommendations={costOnlyRecommendations}
      />
    );
    expect(screen.getByText('Current configuration')).toBeInTheDocument();
    expect(screen.getByText('Recommended configuration')).toBeInTheDocument();
    expect(screen.queryByText(/No recommendations available/i)).not.toBeInTheDocument();
  });
});
