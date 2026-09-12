import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { FetchStatus } from 'store/common';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from './data';
import OptimizationsBreakdown from './optimizationsBreakdown';

const queryStateName = 'optimizationsDetailsState';
const mockLocation = {
  search: '?id=test-id',
  state: {
    [queryStateName]: {
      interval: Interval.medium_term,
      optimizationType: OptimizationType.performance,
    },
  },
};

const mockReport = {
  recommendations: data.data[0].recommendations,
};

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => mockUseSelector(selector),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => mockLocation,
}));

jest.mock('components/featureToggle', () => ({
  useIsBoxPlotToggleEnabled: () => true,
  useIsNamespaceToggleEnabled: () => true,
}));

jest.mock('store/ros', () => ({
  rosActions: {
    fetchRosReport: jest.fn(),
  },
  rosSelectors: {
    selectRos: jest.fn(),
    selectRosFetchStatus: jest.fn(),
    selectRosError: jest.fn(),
  },
}));

jest.mock('./optimizationsBreakdownHeader', () => ({
  OptimizationsBreakdownHeader: ({ currentInterval, optimizationType }: any) => (
    <div>
      <span data-testid="header-interval">{currentInterval}</span>
      <span data-testid="header-optimization-type">{optimizationType}</span>
    </div>
  ),
}));

jest.mock('./optimizationsBreakdownConfiguration', () => ({
  OptimizationsBreakdownConfiguration: () => <div data-testid="configuration" />,
}));

jest.mock('./optimizationsBreakdownUtilization', () => ({
  OptimizationsBreakdownUtilization: () => <div data-testid="utilization" />,
}));

describe('OptimizationsBreakdown', () => {
  const mockSelectors = (report: unknown, status: unknown, error: unknown) => {
    let index = 0;
    const values = [report, status, error];
    mockUseSelector.mockImplementation(() => values[index++ % 3]);
  };

  beforeEach(() => {
    mockUseSelector.mockReset();
    mockSelectors(mockReport, FetchStatus.complete, undefined);
  });

  test('syncs interval and optimization type from route state after report loads', async () => {
    render(
      <IntlProvider locale="en">
        <OptimizationsBreakdown queryStateName={queryStateName} />
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header-interval')).toHaveTextContent(Interval.medium_term);
    });
    expect(screen.getByTestId('header-optimization-type')).toHaveTextContent(OptimizationType.performance);
    expect(screen.getByTestId('configuration')).toBeInTheDocument();
    expect(screen.getByTestId('utilization')).toBeInTheDocument();
  });

  test('shows a notifications alert and switches tabs', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUseSelector.mockReset();
    let index = 0;
    const notified = {
      recommendations: {
        ...data.data[0].recommendations,
        recommendation_terms: {
          ...data.data[0].recommendations.recommendation_terms,
          medium_term: {
            ...data.data[0].recommendations.recommendation_terms.medium_term,
            recommendation_engines: {
              ...data.data[0].recommendations.recommendation_terms.medium_term.recommendation_engines,
              performance: {
                ...data.data[0].recommendations.recommendation_terms.medium_term.recommendation_engines.performance,
                notifications: { x: { code: 111, message: 'Watch this' } },
              },
            },
          },
          short_term: {
            ...data.data[0].recommendations.recommendation_terms.short_term,
            recommendation_engines: {
              ...data.data[0].recommendations.recommendation_terms.short_term.recommendation_engines,
              performance: {
                ...data.data[0].recommendations.recommendation_terms.short_term.recommendation_engines.performance,
                notifications: { x: { code: 111, message: 'Watch this' } },
              },
            },
          },
        },
      },
    };
    const values = [notified, FetchStatus.complete, undefined];
    mockUseSelector.mockImplementation(() => values[index++ % 3]);

    render(
      <IntlProvider locale="en">
        <OptimizationsBreakdown queryStateName={queryStateName} />
      </IntlProvider>
    );

    expect(await screen.findByText('Watch this')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /cost optimizations/i }));
  });

  test('renders a loading state while the report is in progress', () => {
    mockUseSelector.mockReset();
    let index = 0;
    const values = [undefined, FetchStatus.inProgress, undefined];
    mockUseSelector.mockImplementation(() => values[index++ % 3]);
    render(
      <IntlProvider locale="en">
        <OptimizationsBreakdown queryStateName={queryStateName} />
      </IntlProvider>
    );
    expect(screen.getByText('Looking for optimizations...')).toBeInTheDocument();
  });
});
