import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { configureStore } from 'store/store';

import PriceListBreakdown from './priceListBreakdown';

jest.mock('./rates', () => ({
  Rates: ({ canWrite }: { canWrite?: boolean }) => (
    <div data-testid="rates-panel">{canWrite ? 'write' : 'read'}</div>
  ),
}));

jest.mock('./costModels', () => ({
  CostModels: () => <div data-testid="cost-models-panel" />,
}));

jest.mock('routes/settings/priceList/utils/hooks', () => {
  const actual = jest.requireActual('routes/settings/priceList/utils/hooks');
  return {
    ...actual,
    usePriceListUpdate: () => ({
      error: undefined,
      notification: null,
      status: require('store/common').FetchStatus.complete,
    }),
  };
});

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, fetchPriceList: jest.fn() };
});

import * as api from 'api/priceList';

const consoleWarn = console.warn;

describe('priceListBreakdown', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('React Router Future Flag')) {
        return;
      }
      consoleWarn.call(console, msg, ...args);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 1 },
        data: [{ name: 'PL', uuid: 'u1' }],
      },
    });
  });

  test('renders rates tab by default and switches to cost models tab', async () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-1']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<PriceListBreakdown />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('rates-panel')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/^assigned cost models$/i));
    await waitFor(() => expect(screen.getByTestId('cost-models-panel')).toBeInTheDocument());
  });

  test('shows unavailable state when price list fetch fails', async () => {
    (api.fetchPriceList as jest.Mock).mockRejectedValueOnce(new Error('err'));
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-bad']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<PriceListBreakdown />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument());
  });
});
