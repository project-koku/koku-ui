import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { AddPriceListModal } from './addPriceListModal';

jest.mock('../priceListContent', () => ({
  PriceListContent: React.forwardRef((_props: any, ref: any) => {
    React.useEffect(() => _props.onDisabled?.(false), [_props.onDisabled]);
    React.useImperativeHandle(ref, () => ({
      save: () => _props.onAdd?.([{ uuid: 'pl-new', name: 'New', priority: 1 }]),
    }));
    return <div data-testid="price-list-content" />;
  }),
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

import * as api from 'api/costModels';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  price_lists: [],
} as any;

describe('AddPriceListModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('save dispatches update and calls onAdd', async () => {
    const onAdd = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <AddPriceListModal costModel={costModel} isOpen onAdd={onAdd} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^save$/i }));
    await waitFor(() => expect(api.updateCostModel).toHaveBeenCalled());
    await waitFor(() => expect(onAdd).toHaveBeenCalled());
  });
});
