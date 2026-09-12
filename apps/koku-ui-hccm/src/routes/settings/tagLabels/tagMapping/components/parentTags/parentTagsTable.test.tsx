import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ParentTagsTable } from './parentTagsTable';

const settings = {
  data: [
    { uuid: 'p-1', key: 'env', source_type: 'AWS' },
    { uuid: 'p-2', key: 'app', source_type: 'OCP' },
  ],
  meta: { count: 2 },
} as any;

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <ParentTagsTable
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

describe('ParentTagsTable', () => {
  test('returns no rows when settings is missing', () => {
    renderTable({ settings: null });
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders parent tag rows and selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    renderTable({ onSelect });

    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    await user.click(screen.getAllByRole('radio')[0]);
    expect(onSelect).toHaveBeenCalled();
  });
});
