import { fireEvent, render } from '@testing-library/react';
import { filterByAll } from 'api/costModels.data';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';
import { rootReducer, RootState } from 'store/rootReducer';

import CostModelsToolbar from './toolbar';
import { initialCostModelsQuery } from './utils/query';

const history = createMemoryHistory();
const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  return render(
    <Provider store={store}>
      <Router history={history}>
        <CostModelsToolbar />
      </Router>
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
  const { queryAllByText } = renderUI(state);
  expect(queryAllByText(/randomName/)).toHaveLength(1);
  expect(queryAllByText(/OCP/)).toHaveLength(1);
  expect(queryAllByText(/randomDesc/)).toHaveLength(1);
});

test('click clear all filters', () => {
  const state = {
    costModels: {
      costModels: filterByAll,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  const { queryAllByText } = renderUI(state);
  fireEvent.click(queryAllByText(/Clear all filters/)[0]);
  expect(history.location.search).toBe('?limit=10&offset=0');
});
