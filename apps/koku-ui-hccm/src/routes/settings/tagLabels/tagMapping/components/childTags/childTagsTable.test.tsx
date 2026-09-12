import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ChildTagsTable } from './childTagsTable';

const settings = {
  data: [
    { uuid: 'c-1', key: 'env', source_type: 'AWS' },
    { uuid: 'c-2', key: 'app', source_type: 'OCP' },
  ],
  meta: { count: 2 },
} as any;

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <ChildTagsTable
        filterBy={{}}
        isLoading={false}
        onSelect={jest.fn()}
        onSort={jest.fn()}
        orderBy={{ key: 'asc' }}
        selectedItems={[]}
        settings={settings}
        {...props}
      />
    </MemoryRouter>
  );

describe('ChildTagsTable', () => {
  test('returns no rows when settings is missing', () => {
    renderTable({ settings: null });
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders child tag rows and selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    renderTable({ onSelect });

    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).toHaveBeenCalled();
  });
});
