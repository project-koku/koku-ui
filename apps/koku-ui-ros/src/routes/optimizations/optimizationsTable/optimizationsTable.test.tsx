import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';

import OptimizationsTable from './optimizationsTable';

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => mockUseSelector(),
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
  NotAvailable: ({ title }: { title?: string }) => <div>{title || 'not-available'}</div>,
}));

jest.mock('routes/components/page/notConfigured', () => ({
  NotConfigured: () => <div>not-configured</div>,
}));

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: () => <div>loading</div>,
}));

jest.mock('./optimizationsDataTable', () => ({
  OptimizationsDataTable: ({ onSort }: { onSort?: (type: string, asc: boolean) => void }) => (
    <div>
      <div data-testid="data-table" />
      <button type="button" onClick={() => onSort?.('container', true)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./optimizationsToolbar', () => ({
  OptimizationsToolbar: ({ onFilterAdded, onFilterRemoved, pagination }: any) => (
    <div>
      {pagination}
      <button type="button" onClick={() => onFilterAdded({ type: 'project', value: 'app' })}>
        add-filter
      </button>
      <button type="button" onClick={() => onFilterRemoved({ type: 'project', value: 'app' })}>
        remove-filter
      </button>
    </div>
  ),
}));

const mockSelectors = (report: unknown, status: unknown, error: unknown) => {
  let index = 0;
  const values = [report, status, error];
  mockUseSelector.mockImplementation(() => values[index++ % 3]);
};

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <OptimizationsTable queryStateName="table" {...props} />
    </MemoryRouter>
  );

describe('OptimizationsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders not available on error', () => {
    mockSelectors(undefined, FetchStatus.complete, new Error('boom'));
    renderTable();
    expect(screen.getByText('Optimizations')).toBeInTheDocument();
  });

  test('renders not configured when there are no optimizations', () => {
    mockSelectors({ meta: { count: 0 } }, FetchStatus.complete, undefined);
    renderTable();
    expect(screen.getByText('not-configured')).toBeInTheDocument();
  });

  test('renders loading while the report is in progress', () => {
    mockSelectors({ meta: { count: 2, limit: 10, offset: 0 } }, FetchStatus.inProgress, undefined);
    renderTable();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  test('renders the data table when complete', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockSelectors({ meta: { count: 20, limit: 10, offset: 0 } }, FetchStatus.complete, undefined);
    renderTable({ cluster: 'cluster-a', project: 'prod' });
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'add-filter' }));
    await user.click(screen.getByRole('button', { name: 'remove-filter' }));
    await user.click(screen.getByRole('button', { name: 'sort' }));
    await user.click(screen.getAllByRole('button', { name: 'Go to next page' })[0]);
  });
});
