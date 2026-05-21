import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { PriceListTable } from './priceListTable';

jest.mock('./components/actions', () => ({
  RemovePriceListAction: () => null,
  PriceListActions: () => null,
}));

jest.mock('routes/components/dataTable', () => ({
  DraggableTable: (props: any) => (
    <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0}>
      <button type="button" onClick={() => props.onSort?.('name', true)}>
        sort
      </button>
    </div>
  ),
}));

const priceLists = [
  {
    uuid: 'pl-1',
    name: 'Standard',
    priority: 1,
    effective_start_date: '2024-01-01',
    effective_end_date: '2024-12-31',
  },
] as any;

describe('costModel breakdown PriceListTable', () => {
  test('renders price list rows', async () => {
    render(
      <IntlProvider locale="en">
        <PriceListTable
          canWrite
          costModel={{ uuid: 'cm-1', name: 'Model' } as any}
          priceLists={priceLists}
          onSelect={jest.fn()}
          selectedItems={[]}
        />
      </IntlProvider>
    );
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '1'));
  });
});
