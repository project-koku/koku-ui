import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { RemovePriceListModal } from './removePriceListModal';

jest.mock('../review', () => ({
  ReviewChangeModal: ({ isOpen, onConfirm }: { isOpen?: boolean; onConfirm?: () => void }) =>
    isOpen ? (
      <button type="button" onClick={onConfirm}>
        confirm-remove
      </button>
    ) : null,
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  price_lists: [
    { uuid: 'pl-1', name: 'A' },
    { uuid: 'pl-2', name: 'B' },
  ],
} as any;

const selectedItems = [{ uuid: 'pl-1', name: 'A' }] as any;

describe('RemovePriceListModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('confirm without dispatch invokes onRemove', () => {
    const onRemove = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <RemovePriceListModal
            costModel={costModel}
            isDispatch={false}
            isOpen
            onClose={jest.fn()}
            onRemove={onRemove}
            selectedItems={selectedItems}
          />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /confirm-remove/i }));
    expect(onRemove).toHaveBeenCalledWith(selectedItems);
  });
});
