import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { PriceListBreakdownHeader } from './priceListBreakdownHeader';

jest.mock('routes/settings/priceList/components/actions', () => ({
  PriceListActions: () => <div data-testid="actions-stub" />,
}));

jest.mock('routes/settings/priceList/components/details', () => ({
  EditDetailsModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="edit-price-list-modal-open" /> : null,
}));

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

describe('PriceListBreakdownHeader', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const renderHeader = (ui: React.ReactElement) => {
    const store = setupStore();
    return render(
      <MemoryRouter future={routerFuture}>
        <Provider store={store}>
          <IntlProvider defaultLocale="en" locale="en">
            {ui}
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    );
  };

  const baseItem = {
    currency: 'USD',
    description: 'A sample list',
    enabled: true,
    name: 'North America',
    updated_timestamp: '2024-06-01T12:00:00Z',
    uuid: 'pl-1',
    version: 2,
  } as any;

  test('renders title, breadcrumbs, and opens the edit modal from Edit details', () => {
    renderHeader(<PriceListBreakdownHeader canWrite priceList={baseItem} />);
    expect(screen.getByRole('heading', { name: /north america/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /price list/i })).toBeInTheDocument();
    expect(screen.queryByTestId('edit-price-list-modal-open')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^edit details$/i }));
    expect(screen.getByTestId('edit-price-list-modal-open')).toBeInTheDocument();
  });

  test('shows deprecated label when the price list is disabled', () => {
    renderHeader(<PriceListBreakdownHeader priceList={{ ...baseItem, enabled: false }} />);
    expect(screen.getByText(/^deprecated$/i)).toBeInTheDocument();
  });
});
