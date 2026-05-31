import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { DeleteIntegrationModal } from './deleteIntegrationModal';

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

import * as api from 'api/costModels';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  sources: [
    { uuid: 's1', name: 'Source A' },
    { uuid: 's2', name: 'Source B' },
  ],
} as any;

describe('DeleteIntegrationModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('delete dispatches update and calls onDelete', async () => {
    const onDelete = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DeleteIntegrationModal
            costModel={costModel}
            isOpen
            onDelete={onDelete}
            sources={costModel.sources}
            uuid="s1"
          />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(api.updateCostModel).toHaveBeenCalled());
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(['s2']));
  });

  test('cancel calls onClose', () => {
    const onClose = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DeleteIntegrationModal
            costModel={costModel}
            isOpen
            onClose={onClose}
            sources={costModel.sources}
            uuid="s1"
          />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
