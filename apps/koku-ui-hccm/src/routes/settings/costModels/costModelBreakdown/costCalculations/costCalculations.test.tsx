import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { CostCalculations } from './costCalculations';

jest.mock('./markup', () => ({
  Markup: () => <div data-testid="markup-panel" />,
}));

jest.mock('./distribution', () => ({
  Distribution: () => <div data-testid="distribution-panel" />,
}));

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  markup: { value: '10', unit: 'percent' },
  distribution: { cost_type: 'cpu', cost_weight: { cpu: 100 } },
} as any;

describe('CostCalculations', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('renders markup and distribution panels', () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <CostCalculations canWrite costModel={costModel} onSave={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByTestId('markup-panel')).toBeInTheDocument();
    expect(screen.getByTestId('distribution-panel')).toBeInTheDocument();
  });

  test('non-OCP cost model shows markup only', () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <CostCalculations canWrite costModel={{ ...costModel, source_type: 'AWS' }} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByTestId('markup-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('distribution-panel')).not.toBeInTheDocument();
  });
});
