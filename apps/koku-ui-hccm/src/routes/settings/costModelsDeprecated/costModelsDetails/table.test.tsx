import { render, screen } from '@testing-library/react';
import { emptyPage, noMatchPageName, page1 } from 'api/costModels.data';
import messages from 'locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';
import { defaultState as costModelsDefaultState } from 'store/costModels/costModelReducer';
import type { RootState } from 'store/rootReducer';
import { rootReducer } from 'store/rootReducer';

import CostModelsTable from './table';

const createCostModelsState = (costModels: any, fetchStatus = FetchStatus.complete) => ({
  ...costModelsDefaultState,
  costModels,
  fetch: { status: fetchStatus, error: null },
});

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <CostModelsTable />,
      },
    ],
    {
      // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
      initialEntries: ['/'],
      // We don't need to explicitly set this, but it's nice to have.
      initialIndex: 0,
    }
  );
  return render(
    <Provider store={store}>
      <RouterProvider
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        } as any}
        router={router}
      />
    </Provider>
  );
};

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

test('loading table', () => {
  renderUI({});
  expect(screen.queryAllByText(/Looking for integrations/i)).toHaveLength(1);
});

// Todo: Replace no_cost_models_title with default message string
test('empty table', () => {
  const state = {
    costModels: createCostModelsState(emptyPage),
  };
  renderUI(state);
  expect(screen.queryAllByText(regExp(messages.costModelsEmptyState))).toHaveLength(1);
});

test('first page table', () => {
  const state = {
    costModels: createCostModelsState(page1),
  };
  renderUI(state);
  expect(screen.queryAllByText(/Cost Management Azure Cost Model/i)).toHaveLength(1);
  expect(screen.queryAllByText(/Cost Management AWS Cost Model/i)).toHaveLength(1);
  expect(screen.queryAllByText(/Cost Management OpenShift Cost Model/i)).toHaveLength(1);
});

test('no match table', () => {
  const state = {
    costModels: createCostModelsState(noMatchPageName),
  };
  renderUI(state);
  expect(screen.queryAllByText(/No match found/i)).toHaveLength(1);
});
