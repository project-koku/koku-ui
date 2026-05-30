import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { DistributionModal } from './distributionModal';

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  distribution: { cost_type: 'cpu', cost_weight: { cpu: 100 } },
} as any;

describe('DistributionModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('renders and closes on cancel', () => {
    const onClose = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DistributionModal canWrite costModel={costModel} isOpen onClose={onClose} onSave={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('save without dispatch calls onSave', () => {
    const onSave = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DistributionModal
            canWrite
            costModel={costModel}
            isDispatch={false}
            isOpen
            onClose={jest.fn()}
            onSave={onSave}
          />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalled();
  });
});
