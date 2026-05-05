import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { RatesToolbar } from './ratesToolbar';

jest.mock('routes/settings/priceList/components/editRate', () => {
  const actual = jest.requireActual('routes/settings/priceList/components/editRate');
  return {
    ...actual,
    EditRateModal: () => null,
  };
});

describe('RatesToolbar', () => {
  const dummyReducer = (state: Record<string, unknown> = {}) => state;

  const renderToolbar = (ui: React.ReactElement) => {
    const store = createStore(dummyReducer as any);
    return render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );
  };

  const noop = jest.fn();
  const baseQuery = { filter_by: {}, limit: 10, offset: 0, order_by: { name: 'asc' } } as any;
  const priceList = {} as any;

  test('renders Add rate action when writable', () => {
    renderToolbar(
      <RatesToolbar
        canWrite
        isDisabled={false}
        itemsPerPage={3}
        itemsTotal={3}
        onAddRate={noop}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        pagination={<div data-testid="pagination-stub" />}
        priceList={priceList}
        query={baseQuery}
      />
    );
    expect(screen.getByRole('button', { name: /^add rate$/i })).toBeInTheDocument();
  });

  test('disables Add rate when not writable', () => {
    renderToolbar(
      <RatesToolbar
        canWrite={false}
        isDisabled={false}
        itemsPerPage={1}
        itemsTotal={1}
        onAddRate={noop}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        priceList={priceList}
        query={baseQuery}
      />
    );
    expect(screen.getByRole('button', { name: /^add rate$/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
