import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { PriceListsToolbar } from './priceListsToolbar';

describe('PriceListsToolbar', () => {
  const dummyReducer = (state: Record<string, unknown> = {}) => state;

  const renderWithStore = (ui: React.ReactElement) => {
    const store = createStore(dummyReducer as any);
    return render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );
  };

  const baseProps = {
    onBulkSelect: jest.fn(),
    onFilterAdded: jest.fn(),
    onFilterRemoved: jest.fn(),
    onShowDeprecated: jest.fn(),
    query: { filter_by: {}, order_by: { name: 'asc' }, limit: 10, offset: 0 } as any,
    selectedItems: [],
    showBulkSelectAll: false,
  };

  test('renders create action and deprecated switch', () => {
    renderWithStore(<PriceListsToolbar {...baseProps} canWrite isDisabled={false} />);
    expect(screen.getByRole('button', { name: /create price list/i })).toBeInTheDocument();
    expect(screen.getByText(/show deprecated/i)).toBeInTheDocument();
  });

  test('notifies parent when deprecated switch toggles', () => {
    const onShowDeprecated = jest.fn();
    renderWithStore(<PriceListsToolbar {...baseProps} onShowDeprecated={onShowDeprecated} />);
    fireEvent.click(screen.getByRole('switch', { name: /show deprecated/i }));
    expect(onShowDeprecated).toHaveBeenCalled();
  });

  test('invokes onCreate when create is clicked and writable', () => {
    const onCreate = jest.fn();
    renderWithStore(<PriceListsToolbar {...baseProps} canWrite isDisabled={false} onCreate={onCreate} />);
    fireEvent.click(screen.getByRole('button', { name: /create price list/i }));
    expect(onCreate).toHaveBeenCalled();
  });
});
