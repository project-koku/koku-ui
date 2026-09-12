import { render, screen } from '@testing-library/react';
import React from 'react';
import { FetchStatus } from 'store/common';

import OcpOptimizationsStaging from './ocpOptimizationsStaging';

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => mockUseSelector(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ search: '', state: {} }),
}));

jest.mock('store/ros', () => ({
  rosActions: { fetchRosReport: jest.fn() },
  rosSelectors: {
    selectRos: jest.fn(),
    selectRosFetchStatus: jest.fn(),
    selectRosError: jest.fn(),
  },
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div>not-available</div>,
}));

jest.mock('routes/components/page/notConfigured', () => ({
  NotConfigured: () => <div>not-configured</div>,
}));

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: () => <div>loading</div>,
}));

jest.mock('routes/optimizations/optimizationsOcpBreakdown', () => ({
  OptimizationsOcpBreakdown: ({ project }: { project?: string }) => <div data-testid="ocp-breakdown">{project}</div>,
}));

const mockSelectors = (report: unknown, status: unknown, error: unknown) => {
  let index = 0;
  const values = [report, status, error];
  mockUseSelector.mockImplementation(() => values[index++ % 3]);
};

describe('OcpOptimizationsStaging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders not available on error', () => {
    mockSelectors(undefined, FetchStatus.complete, new Error('boom'));
    render(<OcpOptimizationsStaging />);
    expect(screen.getByText('not-available')).toBeInTheDocument();
  });

  test('renders loading while in progress', () => {
    mockSelectors(undefined, FetchStatus.inProgress, undefined);
    render(<OcpOptimizationsStaging />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  test('renders not configured when there is no project', () => {
    mockSelectors({ data: [] }, FetchStatus.complete, undefined);
    render(<OcpOptimizationsStaging />);
    expect(screen.getByText('not-configured')).toBeInTheDocument();
  });

  test('renders the ocp breakdown when a project exists', () => {
    mockSelectors({ data: [{ project: 'app' }] }, FetchStatus.complete, undefined);
    render(<OcpOptimizationsStaging />);
    expect(screen.getByTestId('ocp-breakdown')).toHaveTextContent('app');
  });
});
