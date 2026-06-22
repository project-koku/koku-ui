import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CostModelTable } from './costModelTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => (
    <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0}>
      <button type="button" onClick={() => props.onSort?.('name', true)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./components/actions', () => ({
  DeleteCostModelAction: () => <span data-testid="delete-action" />,
}));

const costModels = {
  data: [
    {
      uuid: 'cm-1',
      name: 'Model A',
      description: 'desc',
      source_type: 'OpenShift Container Platform',
      sources: [{ uuid: 's1' }],
      updated_timestamp: '2024-01-01',
    },
  ],
  meta: { count: 1 },
} as any;

describe('CostModelTable', () => {
  test('renders rows and handles sort', async () => {
    const onSort = jest.fn();
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <CostModelTable canWrite costModels={costModels} onSort={onSort} />
        </IntlProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '1'));
    fireEvent.click(screen.getByRole('button', { name: /sort/i }));
    expect(onSort).toHaveBeenCalledWith('name', true);
  });
});
