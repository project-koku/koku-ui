import { render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { providersReducer, providersStateKey } from 'store/providers';

import { IntegrationContent, type IntegrationContentHandle } from './integrationContent';

jest.mock('./integrationContentTable', () => ({
  IntegrationContentTable: () => <div data-testid="content-table" />,
}));

jest.mock('./integrationContentToolbar', () => ({
  IntegrationContentToolbar: () => <div data-testid="content-toolbar" />,
}));

jest.mock('api/providers', () => {
  const actual = jest.requireActual('api/providers');
  return { ...actual, fetchProviders: jest.fn() };
});

import * as api from 'api/providers';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  sources: [{ uuid: 's1', name: 'Source 1' }],
} as any;

describe('IntegrationContent', () => {
  const setupStore = () =>
    createStore(combineReducers({ [providersStateKey]: providersReducer }), applyMiddleware(thunk));

  beforeEach(() => {
    (api.fetchProviders as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 1 },
        data: [{ uuid: 'p1', name: 'Provider 1' }],
      },
    });
  });

  test('renders toolbar and table after fetch', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <IntegrationContent canWrite costModel={costModel} onAdd={jest.fn()} onDisabled={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('content-toolbar')).toBeInTheDocument());
    expect(screen.getByTestId('content-table')).toBeInTheDocument();
  });

  test('save ref is callable', async () => {
    const ref = createRef<IntegrationContentHandle>();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <IntegrationContent canWrite costModel={costModel} onAdd={jest.fn()} onDisabled={jest.fn()} ref={ref} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(api.fetchProviders).toHaveBeenCalled());
    ref.current?.save();
  });
});
