import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import SelectableTable from './selectableTable';

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
  { name: 'Cost', value: 'cost' },
];

const rows = [
  { selected: false, cells: [{ value: 'Alpha' }, { value: '$1' }] },
  { selected: false, cells: [{ value: 'Beta' }, { value: '$2' }] },
];

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <SelectableTable
        columns={columns}
        rows={rows}
        filterBy={undefined}
        orderBy={{ name: 'asc' }}
        onSort={jest.fn()}
        onRowClick={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('SelectableTable', () => {
  test('renders rows', () => {
    renderTable();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('renders a loading spinner', () => {
    renderTable({ isLoading: true, rows: [] });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders empty states', () => {
    const { rerender } = render(
      <MemoryRouter>
        <SelectableTable
          columns={columns}
          rows={[]}
          filterBy={{ project: 'missing' }}
          orderBy={{}}
          onSort={jest.fn()}
          onRowClick={jest.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'No match found' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <SelectableTable
          columns={columns}
          rows={[]}
          filterBy={undefined}
          emptyState={<div>custom empty</div>}
          orderBy={{}}
          onSort={jest.fn()}
          onRowClick={jest.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('custom empty')).toBeInTheDocument();
  });

  test('calls onRowClick', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onRowClick = jest.fn();
    renderTable({ onRowClick });

    await user.click(screen.getByText('Beta'));
    expect(onRowClick).toHaveBeenCalledWith(1);
  });
});
