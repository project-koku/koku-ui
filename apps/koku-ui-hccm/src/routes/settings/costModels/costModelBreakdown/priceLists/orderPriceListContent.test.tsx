import { act, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { updateCostModelsFailure } from 'store/costModels/costModelActions';
import { configureStore } from 'store/store';

import { OrderPriceListContent, type OrderPriceListContentHandle } from './orderPriceListContent';

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available-stub" />,
}));

jest.mock('./components/charts/timelineChart', () => ({
  TimelineChart: () => <div data-testid="timeline-chart" />,
}));

jest.mock('./orderPriceListTable', () => ({
  OrderPriceListTable: () => <div data-testid="cm-price-list-table" />,
}));

jest.mock('./orderPriceListToolbar', () => ({
  OrderPriceListToolbar: () => <div data-testid="cm-price-list-toolbar" />,
}));

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  price_lists: [{ uuid: 'pl-1', name: 'Standard', priority: 1 }],
} as any;

const priceLists = [{ uuid: 'pl-1', name: 'Standard', priority: 1 }] as any;

describe('OrderPriceListContent', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  const renderContent = (props: Partial<React.ComponentProps<typeof OrderPriceListContent>> = {}) =>
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <OrderPriceListContent
            canWrite
            costModel={costModel}
            onFilterAdded={jest.fn()}
            onFilterRemoved={jest.fn()}
            onPerPage={jest.fn()}
            onPageNumber={jest.fn()}
            pageNumber={1}
            perPage={10}
            priceLists={priceLists}
            priceListsTotal={1}
            {...props}
          />
        </IntlProvider>
      </Provider>
    );

  test('renders chart, toolbar, and table', async () => {
    renderContent();
    await waitFor(() => expect(screen.getByTestId('timeline-chart')).toBeInTheDocument());
    expect(screen.getByTestId('cm-price-list-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('cm-price-list-table')).toBeInTheDocument();
  });

  test('save ref calls onSave when isDispatch is false', async () => {
    const onSave = jest.fn();
    const ref = createRef<OrderPriceListContentHandle>();
    renderContent({ isDispatch: false, onSave, ref });
    await waitFor(() => expect(screen.getByTestId('cm-price-list-table')).toBeInTheDocument());
    act(() => {
      ref.current?.save();
    });
    expect(onSave).toHaveBeenCalledWith([{ uuid: 'pl-1', name: 'Standard', priority: 1 }]);
  });

  test('isWizardStep mode hides toolbar and skips card layout', async () => {
    renderContent({ isWizardStep: true });
    await waitFor(() => expect(screen.getByTestId('timeline-chart')).toBeInTheDocument());
    expect(screen.getByTestId('cm-price-list-table')).toBeInTheDocument();
    expect(screen.queryByTestId('cm-price-list-toolbar')).not.toBeInTheDocument();
    expect(document.querySelector('.pf-v6-c-card')).not.toBeInTheDocument();
  });

  test('shows loading state when isLoading', async () => {
    renderContent({ isLoading: true });
    await waitFor(() => expect(screen.getByTestId('timeline-chart')).toBeInTheDocument());
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows NotAvailable when update error is set', async () => {
    const store = configureStore({} as any);
    act(() => {
      store.dispatch(updateCostModelsFailure(new Error('oops') as any));
    });
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OrderPriceListContent canWrite costModel={costModel} priceLists={priceLists} priceListsTotal={1} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('not-available-stub')).toBeInTheDocument());
  });
});
