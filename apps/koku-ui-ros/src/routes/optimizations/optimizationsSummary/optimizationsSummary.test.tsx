import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';

import { OptimizationsSummary } from './optimizationsSummary';

const mockUseSelector = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockUseSelector(),
}));

jest.mock('store/ros', () => ({
  rosActions: {
    fetchRosReport: jest.fn(() => ({ type: 'fetch' })),
  },
  rosSelectors: {
    selectRos: jest.fn(),
    selectRosFetchStatus: jest.fn(),
    selectRosError: jest.fn(),
  },
}));

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: (message: { defaultMessage?: string }) => message?.defaultMessage ?? '',
    }),
  };
});

const mockSelectors = (report: unknown, status: unknown, error: unknown) => {
  let index = 0;
  const values = [report, status, error];
  mockUseSelector.mockImplementation(() => values[index++ % 3]);
};

describe('OptimizationsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders a loading skeleton', () => {
    mockSelectors(undefined, FetchStatus.inProgress, undefined);

    render(<OptimizationsSummary />);
    expect(document.querySelector('.pf-v6-c-skeleton, .pf-c-skeleton')).toBeTruthy();
  });

  test('renders a plain description when there are no recommendations', () => {
    mockSelectors({ meta: { count: 0 } }, FetchStatus.complete, undefined);

    render(<OptimizationsSummary />);
    expect(screen.getByRole('heading', { name: /Optimizations/ })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders a link when recommendations exist', () => {
    mockSelectors({ meta: { count: 4 } }, FetchStatus.complete, undefined);

    render(
      <MemoryRouter>
        <OptimizationsSummary linkPath="/optimizations" linkState={{ from: 'overview' }} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/optimizations');
    expect(mockDispatch).toHaveBeenCalled();
  });
});
