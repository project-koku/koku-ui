import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import DataTable from './dataTable';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

const columns = [
  { name: 'Name', value: 'name', orderBy: 'name', isSortable: true },
  { name: 'Cost', value: 'cost', orderBy: 'cost', isSortable: true },
];

const rows = [
  {
    item: { id: 'a' },
    selected: false,
    cells: [{ value: 'Alpha' }, { value: '$1' }],
  },
  {
    item: { id: 'b' },
    selected: false,
    cells: [{ value: 'Beta' }, { value: '$2' }],
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <DataTable
        intl={intl as any}
        columns={columns}
        rows={rows}
        filterBy={undefined}
        orderBy={{ name: 'asc' }}
        onSelect={jest.fn()}
        onSort={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('DataTable', () => {
  test('renders rows and a sortable header', () => {
    renderTable();
    expect(screen.getByRole('grid', { name: 'Details table' })).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('renders a loading spinner', () => {
    renderTable({ isLoading: true, rows: [] });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders an empty filter state when filters are applied', () => {
    renderTable({ rows: [], filterBy: { project: 'missing' } });
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();
  });

  test('renders a custom empty state', () => {
    renderTable({ rows: [], emptyState: <div>nothing here</div> });
    expect(screen.getByText('nothing here')).toBeInTheDocument();
  });

  test('calls onSort when a sortable column is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    renderTable({ onSort });
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', expect.any(Boolean));
  });

  test('renders nested headers and selectable rows', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    const onSort = jest.fn();
    renderTable({
      isSelectable: true,
      onSelect,
      onSort,
      nestedColumns: [
        { name: 'Group', colSpan: 2, isSortable: true, orderBy: 'group' },
        { name: 'Last reported', isSubheader: true, rowSpan: 2, orderBy: 'last_reported' },
      ],
    });
    expect(screen.getByText('Group')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('renders the default empty state when filters are wildcards', () => {
    renderTable({ rows: [], filterBy: { project: '*' } });
    expect(
      screen.getByText('Processing data to generate a list of all services that sums to a total cost...')
    ).toBeInTheDocument();
  });
});
