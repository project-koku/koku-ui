import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { FetchStatus } from 'store/common';

import { OrderPriceListTable } from './orderPriceListTable';

jest.mock('./utils', () => ({
  useFetchPriceLists: () => ({
    priceList: {
      data: [
        {
          uuid: 'pl-1',
          name: 'Standard',
          version: 2,
          effective_start_date: '2024-01-01',
          effective_end_date: '2024-12-31',
        },
      ],
    },
    priceListError: null,
    priceListFetchStatus: FetchStatus.complete,
  }),
}));

jest.mock('./components/actions', () => ({
  RemovePriceListAction: ({ isDisabled }: { isDisabled?: boolean }) => (
    <div data-testid="remove-action" data-disabled={String(isDisabled ?? false)} />
  ),
  PriceListActions: () => null,
}));

jest.mock('routes/components/dataTable', () => ({
  DraggableTable: (props: any) => (
    <div data-testid="mock-data-table" data-rows={props.rows?.length ?? 0}>
      {props.rows?.map((row: any, index: number) => (
        <span key={row.id ?? `row-${index}`}>{row.cells?.at(-1)?.value}</span>
      ))}
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

describe('costModel breakdown OrderPriceListTable', () => {
  const renderTable = (props: Partial<React.ComponentProps<typeof OrderPriceListTable>> = {}) =>
    render(
      <IntlProvider locale="en">
        <OrderPriceListTable
          canWrite
          costModel={{ uuid: 'cm-1', name: 'Model' } as any}
          priceLists={priceLists}
          onSelect={jest.fn()}
          selectedItems={[]}
          {...props}
        />
      </IntlProvider>
    );

  test('renders price list rows', async () => {
    renderTable();
    await waitFor(() => expect(screen.getByTestId('mock-data-table')).toHaveAttribute('data-rows', '1'));
  });

  test('remove action re-enables when ordering is cancelled', async () => {
    const { rerender } = renderTable({ isDraggable: true });

    await waitFor(() => expect(screen.getByTestId('remove-action')).toHaveAttribute('data-disabled', 'true'));

    rerender(
      <IntlProvider locale="en">
        <OrderPriceListTable
          canWrite
          costModel={{ uuid: 'cm-1', name: 'Model' } as any}
          isDraggable={false}
          priceLists={priceLists}
          onSelect={jest.fn()}
          selectedItems={[]}
        />
      </IntlProvider>
    );

    await waitFor(() => expect(screen.getByTestId('remove-action')).toHaveAttribute('data-disabled', 'false'));
  });
});
