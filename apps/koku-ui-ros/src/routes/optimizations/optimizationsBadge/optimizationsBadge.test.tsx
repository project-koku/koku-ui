import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { FetchStatus } from 'store/common';

import OptimizationsBadge from './optimizationsBadge';

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => mockUseSelector(selector),
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

describe('OptimizationsBadge', () => {
  beforeEach(() => {
    mockUseSelector.mockImplementation(() => undefined);
  });

  test('renders the recommendation count', () => {
    mockUseSelector
      .mockImplementationOnce(() => ({ meta: { count: 4 } }))
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);

    render(
      <IntlProvider locale="en">
        <OptimizationsBadge cluster="cluster-a" />
      </IntlProvider>
    );

    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
