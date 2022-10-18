import { render, screen } from '@testing-library/react';
import { emptyPage, page1 } from 'api/costModels.data';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';
import { rootReducer, RootState } from 'store/rootReducer';

import { CostModelsBottomPagination } from './bottomPagination';
import { initialCostModelsQuery } from './utils/query';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const history = createMemoryHistory();
  return render(
    <Provider store={store}>
      <Router history={history}>
        <CostModelsBottomPagination />
      </Router>
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
