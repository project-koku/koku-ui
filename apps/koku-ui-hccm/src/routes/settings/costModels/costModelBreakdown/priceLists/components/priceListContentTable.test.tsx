import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { PriceListContentTable } from './priceListContentTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0} />,
  DraggableTable: (props: any) => <div data-testid="mock-draggable-table" data-rows={props.rows?.length ?? 0} />,
}));

jest.mock('routes/settings/priceLists/priceList/components/actions', () => ({
  PriceListActions: () => null,
}));

const priceList = {
  data: [
    {
      uuid: 'plv-1',
      name: 'Standard v1',
      version: 1,
      effective_start_date: '2024-01-01',
      effective_end_date: '2024-12-31',
      rates: [{ uuid: 'r1' }],
    },
  ],
} as any;

describe('PriceListContentTable', () => {
  test('renders price list version rows', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <PriceListContentTable
            canWrite
            onSort={jest.fn()}
            priceList={priceList}
            selectedItems={[]}
          />
        </IntlProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '1'));
  });
});
