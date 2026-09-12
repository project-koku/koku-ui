import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { BasicToolbarBase } from './basicToolbar';

const categoryOptions = [
  { name: 'Name', key: 'name' },
];

describe('BasicToolbarBase', () => {
  test('renders filter toolbar and pagination', () => {
    render(
      <BasicToolbarBase
        showFilter
        intl={{} as any}
        pagination={<div>pager</div>}
        actions={<button type="button">toolbar-action</button>}
      />
    );

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByText('pager')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'toolbar-action' })).toBeInTheDocument();
  });

  test('adds a filter from category input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterAdded = jest.fn();

    render(
      <BasicToolbarBase
        categoryOptions={[{ name: 'Name', key: 'name' }]}
        showFilter
        intl={{} as any}
        onFilterAdded={onFilterAdded}
      />
    );

    await user.type(screen.getByPlaceholderText(/name/i), 'payments{enter}');
    expect(onFilterAdded).toHaveBeenCalledWith(expect.objectContaining({ type: 'name', value: 'payments' }));
  });

  test('clears filters and restores query chips', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterRemoved = jest.fn();

    const { rerender } = render(
      <BasicToolbarBase
        showFilter
        useActiveFilters
        intl={{} as any}
        onFilterRemoved={onFilterRemoved}
        query={{ filter_by: { name: ['first'] } }}
      />
    );

    expect(screen.getByText('first')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Clear all filters/i }));
    expect(onFilterRemoved).toHaveBeenCalled();

    rerender(
      <BasicToolbarBase
        showFilter
        useActiveFilters
        intl={{} as any}
        onFilterRemoved={onFilterRemoved}
        query={{ filter_by: { name: ['second'] } }}
      />
    );
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  test('renders bulk select and custom category options', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onBulkSelect = jest.fn();

    render(
      <BasicToolbarBase
        categoryOptions={categoryOptions}
        showFilter
        showBulkSelect
        showBulkSelectAll
        showBulkSelectPage
        itemsTotal={10}
        itemsPerPage={5}
        intl={{} as any}
        onBulkSelect={onBulkSelect}
        selectedItems={[{ id: '1' }]}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onBulkSelect).toHaveBeenCalled();
  });
});
