import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import CompoundExpandTable from './compoundExpandTable';

jest.mock('react-intl', () => {
  const React = require('react');
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }) => defaultMessage ?? id ?? '',
  };
  return {
    ...actual,
    injectIntl: (Comp: any) => (props: any) => React.createElement(Comp, { ...props, intl }),
    useIntl: () => intl,
  };
});

const columns = [
  { name: 'Name', value: 'name', orderBy: 'name', isSortable: true },
  { name: 'Details', value: 'details' },
];

const rows = [
  {
    item: { id: 'a' },
    cells: [
      { value: 'Alpha' },
      { value: 'more', isCompoundExpand: true },
    ],
    children: {
      columns: [{ name: 'Child' }],
      rows: [{ cells: [{ value: 'nested-a' }] }],
    },
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <CompoundExpandTable columns={columns} rows={rows} orderBy={{ name: 'asc' }} onSort={jest.fn()} {...props} />
    </MemoryRouter>
  );

describe('CompoundExpandTable', () => {
  test('renders parent rows', () => {
    renderTable();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  test('renders a loading spinner', () => {
    renderTable({ isLoading: true, rows: [] });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders empty states', () => {
    const { rerender } = render(
      <MemoryRouter>
        <CompoundExpandTable columns={columns} rows={[]} filterBy={{ project: 'missing' }} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <CompoundExpandTable columns={columns} rows={[]} emptyState={<div>custom empty</div>} />
      </MemoryRouter>
    );
    expect(screen.getByText('custom empty')).toBeInTheDocument();
  });

  test('calls onSort and expands a compound cell', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    renderTable({ onSort });

    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', expect.any(Boolean));

    await user.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByText('nested-a')).toBeInTheDocument();
  });
});
