import { render } from '@testing-library/react';
import { emptyPage, noMatchPageName, page1 } from 'api/costModels.data';
import { createMemoryHistory } from 'history';
import messages from 'locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';
import { rootReducer, RootState } from 'store/rootReducer';

import CostModelsTable from './table';
import { initialCostModelsQuery } from './utils/query';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const history = createMemoryHistory();
  return render(
    <Provider store={store}>
      <Router history={history}>
        <CostModelsTable />
      </Router>
    </Provider>
  );
};

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

test('loading table', () => {
  const { queryAllByText } = renderUI({});
  expect(queryAllByText(/Looking for sources/i)).toHaveLength(1);
});

// Todo: Replace no_cost_models_title with default message string
test('empty table', () => {
  const state = {
    costModels: {
      costModels: emptyPage,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  const { queryAllByText } = renderUI(state);
  expect(queryAllByText(regExp(messages.CostModelsEmptyState))).toHaveLength(1);
});

test('first page table', () => {
  const state = {
    costModels: {
      costModels: page1,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  const { queryAllByText } = renderUI(state);
  expect(queryAllByText(/Cost Management Azure Cost Model/i)).toHaveLength(1);
  expect(queryAllByText(/Cost Management AWS Cost Model/i)).toHaveLength(1);
  expect(queryAllByText(/Cost Management OpenShift Cost Model/i)).toHaveLength(1);
});

test('no match table', () => {
  const state = {
    costModels: {
      costModels: noMatchPageName,
      status: FetchStatus.complete,
      error: null,
      query: initialCostModelsQuery,
    },
  };
  const { queryAllByText } = renderUI(state);
  expect(queryAllByText(/No match found/i)).toHaveLength(1);
});
