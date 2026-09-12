import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { BasicToolbarBase } from './basicToolbar';

const categoryOptions = [
  { name: 'Name', key: 'name' },
  { name: 'Project', key: 'project' },
  {
    name: 'Workload type',
    key: 'workload_type',
    selectOptions: [
      { name: 'deployment', key: 'deployment' },
      { name: 'daemonset', key: 'daemonset' },
    ],
  },
];

describe('BasicToolbarBase', () => {
  test('renders filter toolbar with default category options', () => {
    render(<BasicToolbarBase showFilter intl={{} as any} />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });

  test('adds a filter from category input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterAdded = jest.fn();
    render(
      <BasicToolbarBase
        categoryOptions={categoryOptions}
        showFilter
        intl={{} as any}
        onFilterAdded={onFilterAdded}
      />
    );
    await user.type(screen.getByPlaceholderText(/name/i), 'my-filter{enter}');
    expect(onFilterAdded).toHaveBeenCalledWith(expect.objectContaining({ type: 'name', value: 'my-filter' }));
  });

  test('adds a filter, then restores filters from a query update', async () => {
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
    await user.click(screen.getByRole('button', { name: /Clear all filters/i }));
    expect(onFilterRemoved).toHaveBeenCalled();
  });

  test('switches category when multiple options exist', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<BasicToolbarBase categoryOptions={categoryOptions} showFilter intl={{} as any} />);
    await user.click(screen.getByRole('button', { expanded: false }));
    await user.click(screen.getByRole('option', { name: 'Project' }));
    expect(screen.getByPlaceholderText(/project/i)).toBeInTheDocument();
  });

  test('renders actions and pagination', () => {
    render(
      <BasicToolbarBase
        showFilter
        intl={{} as any}
        actions={<button type="button">toolbar-action</button>}
        pagination={<div>pager</div>}
      />
    );
    expect(screen.getByRole('button', { name: 'toolbar-action' })).toBeInTheDocument();
    expect(screen.getByText('pager')).toBeInTheDocument();
  });
});
