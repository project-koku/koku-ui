import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { filterByAll } from '@koku-ui/api/costModels.data';
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from '../../../../store/common';
import type { RootState } from '../../../../store/rootReducer';
import { rootReducer } from '../../../../store/rootReducer';

import CostModelsToolbar from './toolbar';
import { initialCostModelsQuery } from './utils/query';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <CostModelsToolbar />,
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

test('see filter chips in toolbar', () => {
  const state = {
    costModels: {
      costModels: filterByAll,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  renderUI(state);
  expect(screen.queryAllByText(/randomName/)).toHaveLength(1);
  expect(screen.queryAllByText(/OCP/)).toHaveLength(1);
  expect(screen.queryAllByText(/randomDesc/)).toHaveLength(1);
});

xtest('click clear all filters', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const state = {
    costModels: {
      costModels: filterByAll,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  renderUI(state);
  await user.click(screen.queryAllByText(/Clear all filters/)[0]);
  expect(window.location.search).toBe('?limit=10&offset=0');
});
