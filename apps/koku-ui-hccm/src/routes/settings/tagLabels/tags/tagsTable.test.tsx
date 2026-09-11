import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { TagsTable } from './tagsTable';

const settings = {
  data: [
    { uuid: '1', key: 'env', enabled: true, source_type: 'AWS' },
    { uuid: '2', key: 'app', enabled: false, source_type: 'OCP' },
  ],
  meta: { count: 2 },
} as any;

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <TagsTable
        canWrite
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

describe('TagsTable', () => {
  test('returns no rows when settings is missing', () => {
    renderTable({ settings: null });
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders tag rows and selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    const onSort = jest.fn();
    renderTable({ onSelect, onSort, selectedItems: [{ uuid: '1' }] });

    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(onSelect).toHaveBeenCalled();
    await user.click(screen.getAllByRole('button').find(btn => btn.className.includes('pf-v6-c-table__button')));
    expect(onSort).toHaveBeenCalled();
  });
});
