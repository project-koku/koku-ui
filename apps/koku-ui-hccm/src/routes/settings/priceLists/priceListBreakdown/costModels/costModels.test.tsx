import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { configureStore } from 'store/store';

import { CostModels } from './costModels';

jest.mock('./costModelsTable', () => ({
  CostModelsTable: () => <div data-testid="cost-models-table" />,
}));

jest.mock('./costModelsToolbar', () => ({
  CostModelsToolbar: () => <div data-testid="cost-models-toolbar" />,
}));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, fetchPriceList: jest.fn() };
});

import * as api from 'api/priceList';

const consoleWarn = console.warn;

describe('CostModels', () => {
  const renderView = () =>
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-cm']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<CostModels />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );

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
    (api.fetchPriceList as jest.Mock).mockReset();
  });

  test('shows NotAvailable when fetch fails', async () => {
    (api.fetchPriceList as jest.Mock).mockRejectedValue(new Error('network'));
    renderView();
    await waitFor(() => expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument());
  });

  test('shows empty state when no cost models assigned', async () => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 0 },
        assigned_cost_model_count: 0,
        rates: [],
      },
    });
    renderView();
    await waitFor(() => expect(screen.getByRole('button', { name: /go to cost models/i })).toBeInTheDocument());
  });

  test('shows table when cost models are assigned', async () => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 2 },
        assigned_cost_model_count: 2,
        rates: [{}, {}],
      },
    });
    renderView();
    await waitFor(() => expect(screen.getByTestId('cost-models-table')).toBeInTheDocument());
    expect(screen.getByTestId('cost-models-toolbar')).toBeInTheDocument();
  });

});
