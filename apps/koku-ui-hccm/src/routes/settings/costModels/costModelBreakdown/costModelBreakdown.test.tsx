import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { configureStore } from 'store/store';

import CostModelBreakdown from './costModelBreakdown';

jest.mock('./priceLists', () => ({
  OrderPriceList: () => <div data-testid="price-lists-tab" />,
}));

jest.mock('./integrations', () => ({
  Integration: () => <div data-testid="integrations-tab" />,
}));

jest.mock('./costCalculations', () => ({
  CostCalculations: () => <div data-testid="cost-calculations-tab" />,
}));

jest.mock('./costModelBreakdownHeader', () => ({
  CostModelBreakdownHeader: () => <div data-testid="breakdown-header" />,
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, fetchCostModels: jest.fn() };
});

import * as api from 'api/costModels';

const costModel = {
  uuid: 'cm-1',
  name: 'Test model',
  source_type: 'OpenShift Container Platform',
  sources: [],
  price_lists: [],
} as any;

describe('CostModelBreakdown', () => {
  beforeEach(() => {
    (api.fetchCostModels as jest.Mock).mockResolvedValue({
      data: { data: [costModel], meta: { count: 1 } },
    });
  });

  const renderView = (uuid = 'cm-1') =>
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter initialEntries={[`/settings/cost-models/${uuid}`]}>
            <Routes>
              <Route path="/settings/cost-models/:uuid" element={<CostModelBreakdown />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );

  test('renders price lists tab by default', async () => {
    renderView();
    await waitFor(() => expect(screen.getByTestId('price-lists-tab')).toBeInTheDocument());
    expect(screen.getByTestId('breakdown-header')).toBeInTheDocument();
  });

  test('switches to integrations tab', async () => {
    renderView();
    await waitFor(() => expect(screen.getByTestId('price-lists-tab')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/^integrations$/i));
    await waitFor(() => expect(screen.getByTestId('integrations-tab')).toBeInTheDocument());
  });

  test('shows unavailable for invalid uuid error', async () => {
    const err: any = {
      response: { data: { errors: [{ source: 'detail', detail: 'Invalid provider uuid' }] } },
    };
    (api.fetchCostModels as jest.Mock).mockRejectedValueOnce(err);
    renderView('bad-uuid');
    await waitFor(() => expect(screen.getByText(/cost model can not be found/i)).toBeInTheDocument());
  });
});
