import { render, screen, waitFor } from '@testing-library/react';
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
  useIsBoxPlotToggleEnabled: () => false,
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
  OptimizationsBreakdownUtilization: () => null,
}));

describe('OptimizationsBreakdown', () => {
  beforeEach(() => {
    mockUseSelector
      .mockImplementationOnce(() => mockReport)
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);
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
  });
});
