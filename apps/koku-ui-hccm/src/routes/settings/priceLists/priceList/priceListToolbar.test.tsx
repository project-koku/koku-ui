import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import { PriceListToolbar } from './priceListToolbar';

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

describe('PriceListToolbar', () => {
  const dummyReducer = (state: Record<string, unknown> = {}) => state;

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithStore = (ui: React.ReactElement) => {
    const store = createStore(dummyReducer as any);
    return render(
      <Provider store={store}>
        <MemoryRouter future={routerFuture}>
          <IntlProvider defaultLocale="en" locale="en">
            {ui}
          </IntlProvider>
        </MemoryRouter>
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
    renderWithStore(<PriceListToolbar {...baseProps} canWrite isDisabled={false} />);
    expect(screen.getByRole('button', { name: /create a price list/i })).toBeInTheDocument();
    expect(screen.getByText(/show deprecated/i)).toBeInTheDocument();
  });

  test('notifies parent when deprecated switch toggles', () => {
    const onShowDeprecated = jest.fn();
    renderWithStore(<PriceListToolbar {...baseProps} onShowDeprecated={onShowDeprecated} />);
    fireEvent.click(screen.getByRole('switch', { name: /show deprecated/i }));
    expect(onShowDeprecated).toHaveBeenCalled();
  });

  test('navigates to price list create when create is clicked and writable', () => {
    renderWithStore(<PriceListToolbar {...baseProps} canWrite isDisabled={false} />);
    fireEvent.click(screen.getByRole('button', { name: /create a price list/i }));
    expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ replace: true }));
  });
});
