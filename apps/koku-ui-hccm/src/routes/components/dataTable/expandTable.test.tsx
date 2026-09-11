import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import ExpandTable from './expandTable';

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
  { name: '', value: 'expand' },
  { name: 'Name', value: 'name', orderBy: 'name', isSortable: true },
  { name: 'Cost', value: 'cost' },
];

const rows = [
  {
    item: { id: 'a' },
    cells: [{ value: '' }, { value: 'Alpha' }, { value: '$1' }],
    children: [{ cells: [{ value: '' }, { value: 'child-a' }, { value: '$0.50' }] }],
  },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <ExpandTable columns={columns} rows={rows} orderBy={{ name: 'asc' }} onSort={jest.fn()} {...props} />
    </MemoryRouter>
  );

describe('ExpandTable', () => {
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
        <ExpandTable columns={columns} rows={[]} filterBy={{ project: 'missing' }} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ExpandTable columns={columns} rows={[]} emptyState={<div>custom empty</div>} />
      </MemoryRouter>
    );
    expect(screen.getByText('custom empty')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ExpandTable columns={columns} rows={[]} />
      </MemoryRouter>
    );
    expect(
      screen.getByText('Processing data to generate a list of all services that sums to a total cost...')
    ).toBeInTheDocument();
  });

  test('calls onSort and expands a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    renderTable({ onSort });

    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name', expect.any(Boolean));

    await user.click(screen.getByRole('button', { name: /details/i }));
    expect(screen.getByText('child-a')).toBeInTheDocument();
  });

  test('renders a non-array child when expanded by default', () => {
    renderTable({
      isAllExpanded: true,
      rows: [
        {
          item: { id: 'b' },
          cells: [{ value: '' }, { value: 'Beta' }, { value: '$2' }],
          children: <div>nested panel</div>,
        },
      ],
    });
    expect(screen.getByText('nested panel')).toBeInTheDocument();
  });
});
