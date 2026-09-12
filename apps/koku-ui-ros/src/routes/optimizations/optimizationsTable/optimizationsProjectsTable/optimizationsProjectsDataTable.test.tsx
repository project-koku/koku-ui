import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from '../../optimizationsBreakdown/data';
import { OptimizationsProjectsDataTable } from './optimizationsProjectsDataTable';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');
  return {
    ...actual,
    getRequestProps: () => ({
      cpuRequestCurrent: '1 CPU',
      cpuRequestVariation: '0',
      memoryRequestCurrent: '1 MiB',
      memoryRequestVariation: '0',
    }),
  };
});

jest.mock('utils/dates', () => ({
  getTimeFromNow: () => '1 hour ago',
}));

jest.mock('routes/components/dataTable', () => ({
  DataTable: ({ rows, onSort }: any) => (
    <div>
      <div data-testid="rows">
        {rows?.map((row: any, index: number) => (
          <div key={index}>
            {row.cells[0].value}
            {row.cells[1]?.value}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onSort?.('project', true)}>
        sort
      </button>
    </div>
  ),
}));

const recommendations = data.data[0].recommendations;

const reportItem = {
  cluster_alias: 'name222',
  cluster_uuid: '222',
  id: 'item-1',
  last_reported: '2023-12-08T13:09:29+05:30',
  project: 'Yuptoo-prod',
  recommendations,
};

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <OptimizationsProjectsDataTable
        filterBy={undefined}
        linkPath="/breakdown"
        onSort={jest.fn()}
        orderBy={{ project: 'asc' }}
        report={{ data: [reportItem] } as any}
        {...props}
      />
    </MemoryRouter>
  );

describe('OptimizationsProjectsDataTable', () => {
  test('renders a linked project when recommendations exist', () => {
    renderTable();
    expect(screen.getAllByRole('link', { name: 'Yuptoo-prod' }).length).toBeGreaterThan(0);
  });

  test('uses cost and medium-term order-by keys', () => {
    renderTable({ interval: Interval.medium_term, optimizationType: OptimizationType.cost });
    expect(screen.getAllByRole('link', { name: 'Yuptoo-prod' }).length).toBeGreaterThan(0);
  });

  test('uses long-term performance order-by keys', () => {
    renderTable({ interval: Interval.long_term, optimizationType: OptimizationType.performance });
    expect(screen.getAllByRole('link', { name: 'Yuptoo-prod' }).length).toBeGreaterThan(0);
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
    expect(onSort).toHaveBeenCalledWith('project', true);
  });
});
