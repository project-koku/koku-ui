import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { providersReducer, providersStateKey } from 'store/providers';

import { Integration } from './integration';

jest.mock('./integrationTable', () => ({
  IntegrationTable: ({ onSort }: any) => (
    <div data-testid="integration-table">
      <button type="button" onClick={() => onSort?.('name', true)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./integrationToolbar', () => ({
  IntegrationToolbar: ({ onFilterAdded, onFilterRemoved, onAdd }: any) => (
    <div data-testid="integration-toolbar">
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        filter-remove
      </button>
      <button type="button" onClick={() => onAdd?.()}>
        add
      </button>
    </div>
  ),
}));

const costModelWithSources = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  sources: [{ uuid: 's1', name: 'Source 1' }],
} as any;

const costModelEmpty = { ...costModelWithSources, sources: [] };

describe('costModel breakdown Integration', () => {
  const setupStore = () =>
    createStore(
      combineReducers({
        [costModelsStateKey]: costModelsReducer,
        [providersStateKey]: providersReducer,
      }),
      applyMiddleware(thunk)
    );

  test('renders table when sources exist', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <Integration canWrite costModel={costModelWithSources} onAdd={jest.fn()} onDelete={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('integration-table')).toBeInTheDocument());
    expect(screen.getByTestId('integration-toolbar')).toBeInTheDocument();
  });

  test('shows empty state when no sources', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <Integration canWrite costModel={costModelEmpty} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/no integrations are assigned/i)).toBeInTheDocument());
  });

  test('toolbar callbacks run', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <Integration canWrite costModel={costModelWithSources} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('integration-toolbar')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /sort/i }));
  });
});
