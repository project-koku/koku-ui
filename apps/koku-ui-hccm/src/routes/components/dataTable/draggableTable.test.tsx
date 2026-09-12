import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import DraggableTable from './draggableTable';

const columns = [
  { name: 'Name', value: 'name', orderBy: 'name', isSortable: true },
  { name: 'Cost', value: 'cost' },
];

const rows = [
  {
    id: 'row-a',
    item: { id: 'a' },
    selected: false,
    cells: [{ value: 'Alpha' }, { value: '$1' }],
  },
  {
    id: 'row-b',
    item: { id: 'b' },
    selected: false,
    cells: [{ value: 'Beta' }, { value: '$2' }],
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <DraggableTable
        columns={columns}
        rows={rows}
        orderBy={{ name: 'asc' }}
        onSelect={jest.fn()}
        onSort={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('DraggableTable', () => {
  test('renders rows', () => {
    renderTable();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('renders a loading spinner', () => {
    renderTable({ isLoading: true, rows: [] });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders empty filter, exclude, custom, and default empty states', () => {
    const { rerender } = render(
      <MemoryRouter>
        <DraggableTable columns={columns} rows={[]} filterBy={{ project: 'missing' }} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <DraggableTable columns={columns} rows={[]} exclude={{ project: 'skip' }} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <DraggableTable columns={columns} rows={[]} emptyState={<div>custom empty</div>} />
      </MemoryRouter>
    );
    expect(screen.getByText('custom empty')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <DraggableTable columns={columns} rows={[]} filterBy={{ project: '*' }} />
      </MemoryRouter>
    );
    expect(
      screen.getByText('Processing data to generate a list of all services that sums to a total cost...')
    ).toBeInTheDocument();
  });

  test('calls onSort and onSelect', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    const onSelect = jest.fn();
    renderTable({ isSelectable: true, onSort, onSelect });

    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', expect.any(Boolean));

    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).toHaveBeenCalledWith([rows[0].item], true);
  });

  test('renders draggable rows', () => {
    renderTable({ isDraggable: true });
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(document.querySelector('tr[draggable="true"]')).toBeTruthy();
  });
});
