import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { CostCategoryTable } from './costCategoryTable';

const settings = {
  data: [
    { uuid: '1', key: 'env', enabled: true },
    { uuid: '2', key: 'app', enabled: false },
  ],
  meta: { count: 2 },
} as any;

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <CostCategoryTable
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

describe('CostCategoryTable', () => {
  test('returns no rows when settings is missing', () => {
    renderTable({ settings: null });
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders category rows and selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    renderTable({ onSelect, selectedItems: [{ uuid: '1' }] });
    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(onSelect).toHaveBeenCalled();
  });
});
