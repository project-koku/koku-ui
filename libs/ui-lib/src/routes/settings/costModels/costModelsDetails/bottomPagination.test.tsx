import { render, screen } from '@testing-library/react';
import { emptyPage, page1 } from '@koku-ui/api/costModels.data';
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from '../../../../store/common';
import type { RootState } from '../../../../store/rootReducer';
import { rootReducer } from '../../../../store/rootReducer';

import { CostModelsBottomPagination } from './bottomPagination';
import { initialCostModelsQuery } from './utils/query';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <CostModelsBottomPagination />,
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

test('first page pagination', () => {
  const state = {
    costModels: {
      costModels: page1,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  renderUI(state);
  expect(screen.queryAllByText(/1 - 10/i)).toHaveLength(1);
  expect(screen.queryAllByText(/20/i)).toHaveLength(1);
});

test('empty page pagination', () => {
  const state = {
    costModels: {
      costModels: emptyPage,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  renderUI(state);
  expect(screen.queryAllByText(/1 - 10/i)).toHaveLength(0);
  expect(screen.queryAllByText(/0/i)).toMatchSnapshot();
});
