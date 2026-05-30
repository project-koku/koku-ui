import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { CostModels } from 'api/costModels';
import type { AxiosError } from 'axios';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FetchStatus } from 'store/common';
import { defaultState, stateKey } from 'store/costModels/costModelReducer';
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

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available" />,
}));

jest.mock('store/costModels/costModelActions', () => {
  const actual = jest.requireActual('store/costModels/costModelActions');
  return {
    ...actual,
    fetchCostModels: jest.fn(() => () => undefined),
  };
});

const costModel = {
  uuid: 'cm-1',
  name: 'Test model',
  source_type: 'OpenShift Container Platform',
  sources: [],
  price_lists: [],
} as const;

const defaultCostModels: CostModels = {
  data: [costModel as any],
  meta: { count: 1, limit: 10, offset: 0 },
  links: { first: null, last: null, next: null, previous: null },
};

const invalidProviderUuidError = {
  response: {
    data: { errors: [{ source: 'detail', detail: 'Invalid provider uuid' }] },
  },
} as AxiosError;

const genericFetchError = {
  response: { data: { Error: 'Internal server error' } },
} as AxiosError;

const createStore = (fetch: { status: FetchStatus; error: AxiosError | null }, costModels = defaultCostModels) =>
  configureStore({
    [stateKey]: {
      ...defaultState,
      costModels,
      fetch,
    },
  } as any);

describe('CostModelBreakdown', () => {
  const renderView = (uuid = 'cm-1', store = createStore({ status: FetchStatus.complete, error: null })) =>
    render(
      <Provider store={store}>
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

  test('shows uuid empty state when fetch returns invalid provider uuid', async () => {
    renderView('bad-uuid', createStore({ status: FetchStatus.complete, error: invalidProviderUuidError }));
    await waitFor(() => expect(screen.getByText(/cost model can not be found/i)).toBeInTheDocument());
    expect(screen.getByText(/bad-uuid/)).toBeInTheDocument();
    expect(screen.queryByTestId('not-available')).not.toBeInTheDocument();
  });

  test('shows NotAvailable for other fetch errors', async () => {
    renderView('cm-1', createStore({ status: FetchStatus.complete, error: genericFetchError }));
    await waitFor(() => expect(screen.getByTestId('not-available')).toBeInTheDocument());
    expect(screen.queryByText(/cost model can not be found/i)).not.toBeInTheDocument();
  });
});
