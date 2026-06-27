import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';

import OptimizationsLink from './optimizationsLink';

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

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

describe('OptimizationsLink', () => {
  beforeEach(() => {
    mockUseSelector.mockImplementation(() => undefined);
  });

  test('renders a plain count when there are no recommendations', () => {
    mockUseSelector
      .mockImplementationOnce(() => ({ meta: { count: 0 } }))
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);

    render(
      <MemoryRouter future={routerFuture}>
        <OptimizationsLink cluster="cluster-a" linkPath="/optimizations" project="app-dev" />
      </MemoryRouter>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders a link when recommendations exist', () => {
    mockUseSelector
      .mockImplementationOnce(() => ({ meta: { count: 3 } }))
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);

    render(
      <MemoryRouter future={routerFuture}>
        <OptimizationsLink cluster="cluster-a" linkPath="/optimizations" linkState={{ from: 'table' }} project="app-dev" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: '3' });
    expect(link).toHaveAttribute('href', '/optimizations');
  });
});
