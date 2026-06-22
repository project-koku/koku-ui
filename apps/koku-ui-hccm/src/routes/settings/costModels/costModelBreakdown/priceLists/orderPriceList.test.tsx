import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { OrderPriceList } from './orderPriceList';

jest.mock('./components/charts/timelineChart', () => ({
  TimelineChart: () => <div data-testid="timeline-chart" />,
}));

jest.mock('./orderPriceListTable', () => ({
  OrderPriceListTable: ({ onSelect }: any) => (
    <div data-testid="cm-price-list-table">
      <button type="button" onClick={() => onSelect?.([{ uuid: 'pl-1' }])}>
        select
      </button>
    </div>
  ),
}));

jest.mock('./orderPriceListToolbar', () => ({
  OrderPriceListToolbar: ({ onFilterAdded, onFilterRemoved, onOrderClick }: any) => (
    <div data-testid="cm-price-list-toolbar">
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        filter-remove
      </button>
      <button type="button" onClick={() => onOrderClick?.()}>
        reorder
      </button>
    </div>
  ),
}));

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  price_lists: [{ uuid: 'pl-1', name: 'Standard', priority: 1 }],
} as any;

describe('costModel breakdown OrderPriceList', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('renders chart, toolbar, and table', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <OrderPriceList canWrite costModel={costModel} onAdd={jest.fn()} onRemove={jest.fn()} onSave={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('timeline-chart')).toBeInTheDocument());
    expect(screen.getByTestId('cm-price-list-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('cm-price-list-table')).toBeInTheDocument();
  });

  test('toolbar and table callbacks run', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <OrderPriceList canWrite costModel={costModel} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('cm-price-list-toolbar')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /reorder/i }));
    fireEvent.click(screen.getByRole('button', { name: /select/i }));
  });
});
