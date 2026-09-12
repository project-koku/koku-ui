import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { PlatformProjectsTable } from './platformProjectsTable';

jest.mock('routes/components/cluster', () => ({
  Cluster: ({ clusters }: { clusters?: string[] }) => <span>{clusters?.join(',')}</span>,
}));

const settings = {
  data: [
    { project: 'payments', group: 'default', default: false, clusters: ['east'] },
    { project: 'platform', group: 'Platform', default: true, clusters: ['west'] },
  ],
  meta: { count: 2 },
} as any;

const renderTable = (props: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <PlatformProjectsTable
        canWrite
        filterBy={{}}
        isLoading={false}
        onSelect={jest.fn()}
        onSort={jest.fn()}
        orderBy={{ project: 'asc' }}
        selectedItems={[]}
        settings={settings}
        {...props}
      />
    </MemoryRouter>
  );

describe('PlatformProjectsTable', () => {
  test('returns no rows when settings is missing', () => {
    renderTable({ settings: null });
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders project rows and selects a row', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    renderTable({ onSelect });
    expect(screen.getByText('payments')).toBeInTheDocument();
    expect(screen.getByText('platform')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).toHaveBeenCalled();
  });
});
