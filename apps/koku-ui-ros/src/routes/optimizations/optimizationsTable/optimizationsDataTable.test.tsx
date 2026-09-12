import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { data } from '../optimizationsBreakdown/data';
import { OptimizationsDataTable } from './optimizationsDataTable';

jest.mock('utils/dates', () => ({
  getTimeFromNow: () => '1 hour ago',
}));

jest.mock('routes/components/dataTable', () => ({
  DataTable: ({ rows, onSort }: any) => (
    <div>
      <div data-testid="rows">
        {rows?.map((row: any, index: number) => (
          <div key={index}>
            {row.cells.map((cell: any, cellIndex: number) => (
              <span key={cellIndex}>{cell.value}</span>
            ))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onSort?.('container', true)}>
        sort
      </button>
    </div>
  ),
}));

const reportItem = {
  cluster_alias: 'name222',
  cluster_uuid: '222',
  container: 'Yuptoo-service',
  id: 'item-1',
  last_reported: '2023-12-08T13:09:29+05:30',
  project: 'Yuptoo-prod',
  workload: 'yuptoo',
  workload_type: 'deployment',
  recommendations: data.data[0].recommendations,
};

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <OptimizationsDataTable
        filterBy={undefined}
        linkPath="/breakdown"
        onSort={jest.fn()}
        orderBy={{ container: 'asc' }}
        report={{ data: [reportItem] } as any}
        reportQueryString=""
        {...props}
      />
    </MemoryRouter>
  );

describe('OptimizationsDataTable', () => {
  test('renders container rows as links', () => {
    renderTable();
    expect(screen.getAllByRole('link', { name: 'Yuptoo-service' }).length).toBeGreaterThan(0);
  });

  test('hides project and cluster columns', () => {
    renderTable({ isProjectHidden: true, isClusterHidden: true });
    expect(screen.queryByText('Yuptoo-prod')).not.toBeInTheDocument();
    expect(screen.queryByText('name222')).not.toBeInTheDocument();
  });

  test('renders without a report', () => {
    renderTable({ report: undefined });
    expect(screen.getByTestId('rows')).toBeInTheDocument();
  });

  test('calls onSort from the data table', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    renderTable({ onSort });
    await user.click(screen.getByRole('button', { name: 'sort' }));
    expect(onSort).toHaveBeenCalledWith('container', true);
  });
});
