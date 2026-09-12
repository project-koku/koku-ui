import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import DataTable from './dataTable';

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
    selectionTooltip: 'Cannot select this row',
    cells: [{ value: 'Beta' }, { value: '$2' }],
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <DataTable
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
    expect(screen.getByRole('grid')).toBeInTheDocument();
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

  test('renders an empty filter state from exclude values', () => {
    renderTable({ rows: [], exclude: { project: 'skip-me' } });
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();
  });

  test('renders a custom empty state', () => {
    renderTable({ rows: [], emptyState: <div>nothing here</div> });
    expect(screen.getByText('nothing here')).toBeInTheDocument();
  });

  test('renders the default empty state when filters are wildcards', () => {
    renderTable({ rows: [], filterBy: { project: '*' } });
    expect(
      screen.getByText('Processing data to generate a list of all services that sums to a total cost...')
    ).toBeInTheDocument();
  });

  test('calls onSort when a sortable column is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    renderTable({ onSort });
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', expect.any(Boolean));
  });

  test('selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    renderTable({ isSelectable: true, onSelect });
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).toHaveBeenCalledWith([rows[0].item], true);
  });

  test('renders a disabled checkbox with a selection tooltip', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderTable({
      isSelectable: true,
      rows: [{ ...rows[1], selectionDisabled: true }],
    });
    await user.hover(screen.getByRole('checkbox'));
    expect(await screen.findByText('Cannot select this row')).toBeInTheDocument();
  });
});
