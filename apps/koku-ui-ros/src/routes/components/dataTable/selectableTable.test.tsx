import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import SelectableTable from './selectableTable';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

const columns = [
  { name: 'Name', value: 'name', orderBy: 'name', isSortable: true },
  { name: 'Cost', value: 'cost', orderBy: 'cost', isSortable: true },
];

const rows = [
  {
    selected: false,
    cells: [{ value: 'Alpha' }, { value: '$1' }],
  },
  {
    selected: false,
    cells: [{ value: 'Beta' }, { value: '$2' }],
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <SelectableTable
        intl={intl as any}
        columns={columns}
        rows={rows}
        filterBy={undefined}
        orderBy={{ name: 'asc' }}
        onRowClick={jest.fn()}
        onSort={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('SelectableTable', () => {
  test('renders rows and a sortable header', () => {
    renderTable();
    expect(screen.getByRole('grid', { name: 'Selectable table' })).toBeInTheDocument();
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

  test('renders the default empty state', () => {
    renderTable({ rows: [], filterBy: { project: '*' } });
    expect(
      screen.getByText('Processing data to generate a list of all services that sums to a total cost...')
    ).toBeInTheDocument();
  });

  test('calls onSort and onRowClick', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onRowClick = jest.fn();
    renderTable({ onRowClick });
    await user.click(screen.getByText('Beta'));
    expect(onRowClick).toHaveBeenCalledWith(1);
  });
});
