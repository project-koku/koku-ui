import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { PriceListTable } from './priceListTable';

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: any) => (
    <div
      data-testid="mock-data-table"
      data-cols={props.columns?.length ?? 0}
      data-rows={props.rows?.length ?? 0}
    />
  ),
}));

describe('PriceListTable', () => {
  const priceList = {
    data: [
      {
        uuid: 'pl-1',
        name: 'Standard',
        version: 3,
        currency: 'USD',
        effective_start_date: '2024-01-01',
        effective_end_date: '',
        cost_models: 'cm-1',
        default: false,
      },
    ],
    meta: { count: 1, limit: 10, offset: 0 },
  } as any;

  test('passes one row per price list item to DataTable', async () => {
    render(
      <IntlProvider defaultLocale="en" locale="en">
        <PriceListTable
          canWrite
          isDisabled={false}
          onSelect={jest.fn()}
          onSort={jest.fn()}
          priceList={priceList}
          selectedItems={[]}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-data-table');
      expect(table).toHaveAttribute('data-rows', '1');
      expect(Number(table.getAttribute('data-cols'))).toBeGreaterThan(0);
    });
  });
});
