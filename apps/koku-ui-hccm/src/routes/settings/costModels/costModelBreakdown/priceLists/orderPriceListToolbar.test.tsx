import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { OrderPriceListToolbar } from './orderPriceListToolbar';

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions, filter }: any) => (
    <div data-testid="basic-toolbar">
      {actions}
      {filter}
    </div>
  ),
}));

jest.mock('./components/actions', () => ({
  AddPriceListAction: () => <button type="button">add-pl</button>,
  PriceListActions: () => null,
}));

const costModel = { uuid: 'cm-1', name: 'Model', currency: 'USD' } as any;

describe('OrderPriceListToolbar', () => {
  test('renders toolbar with assign action', () => {
    const store = createStore(
      combineReducers({ [costModelsStateKey]: costModelsReducer }),
      applyMiddleware(thunk)
    );
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OrderPriceListToolbar
            canWrite
            costModel={costModel}
            onFilterAdded={jest.fn()}
            onFilterRemoved={jest.fn()}
            selectedItems={[]}
          />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByTestId('basic-toolbar')).toBeInTheDocument();
  });
});
