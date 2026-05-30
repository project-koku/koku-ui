import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { PriceListContentToolbar } from './priceListContentToolbar';

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions, onBulkSelect, onFilterAdded, onFilterRemoved }: any) => (
    <div data-testid="basic-toolbar">
      {actions}
      <button type="button" onClick={() => onBulkSelect?.('page')}>
        bulk-select
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        filter-remove
      </button>
    </div>
  ),
}));

jest.mock('routes/settings/priceLists/priceListCreate/components/actions', () => ({
  CreatePriceListAction: () => <button type="button">create-pl</button>,
}));

describe('PriceListContentToolbar', () => {
  test('renders toolbar actions and invokes callbacks', () => {
    const onBulkSelect = jest.fn();
    const onFilterAdded = jest.fn();
    const onFilterRemoved = jest.fn();
    const onRefresh = jest.fn();

    render(
      <IntlProvider locale="en">
        <PriceListContentToolbar
          canWrite
          onBulkSelect={onBulkSelect}
          onFilterAdded={onFilterAdded}
          onFilterRemoved={onFilterRemoved}
          onRefresh={onRefresh}
          selectedItems={[]}
        />
      </IntlProvider>
    );

    expect(screen.getByTestId('basic-toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create-pl/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /bulk-select/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onBulkSelect).toHaveBeenCalledWith('page');
    expect(onFilterAdded).toHaveBeenCalledWith({ type: 'name', value: 'x' });
    expect(onFilterRemoved).toHaveBeenCalledWith({ type: 'name', value: 'x' });
    expect(onRefresh).toHaveBeenCalled();
  });
});
