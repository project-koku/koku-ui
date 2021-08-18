import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';
import { rootReducer, RootState } from 'store/rootReducer';

import DeleteDialog from './dialog';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const history = createMemoryHistory();
  return render(
    <Provider store={store}>
      <Router history={history}>
        <DeleteDialog />
      </Router>
    </Provider>
  );
};

test('delete dialog closed', () => {
  const { queryAllByText } = renderUI({});
  expect(queryAllByText(/cannot_delete/i)).toHaveLength(0);
  expect(queryAllByText(/can_delete/i)).toHaveLength(0);
});

test('delete dialog open', () => {
  const state = {
    costModels: {
      isDialogOpen: {
        deleteRate: false,
        deleteSource: false,
        addSource: false,
        addRate: false,
        updateRate: false,
        deleteCostModel: true,
        updateCostModel: false,
        deleteMarkup: false,
        updateMarkup: false,
        createWizard: false,
      },
      dialogData: {
        costModel: {
          name: 'cost-model-name-1',
          uuid: '12de-fe56-e091-f33d',
          sources: [],
        },
      },
      delete: {
        error: null,
        status: FetchStatus.complete,
      },
    },
  };
  const { getByText, queryAllByText } = renderUI(state);
  expect(queryAllByText(/delete_title/i)).toHaveLength(1);
  expect(queryAllByText(/can_delete/i)).toHaveLength(1);
  expect(queryAllByText(/cannot_delete/i)).toHaveLength(0);
  fireEvent.click(getByText(/delete_cost_model/i));
  expect(getByText(/delete_cost_model/i).closest('button').disabled).toBeTruthy();
});

test('delete dialog error', () => {
  const state = {
    costModels: {
      isDialogOpen: {
        deleteRate: false,
        deleteSource: false,
        addSource: false,
        addRate: false,
        updateRate: false,
        deleteCostModel: true,
        updateCostModel: false,
        deleteMarkup: false,
        updateMarkup: false,
        createWizard: false,
      },
      dialogData: {
        costModel: {
          name: 'cost-model-name-1',
          uuid: '12de-fe56-e091-f33d',
          sources: [{ name: 'source-1', uuid: '1234-abcd-5678-efgh' }],
        },
      },
      delete: {
        error: null,
        status: FetchStatus.complete,
      },
    },
  };
  const { getByText, queryAllByText } = renderUI(state);
  expect(queryAllByText(/delete_title/i)).toHaveLength(1);
  expect(queryAllByText(/can_delete/i)).toHaveLength(0);
  expect(queryAllByText(/cannot_delete/i)).toHaveLength(2);
  fireEvent.click(getByText(/cancel/i));
  expect(queryAllByText(/delete_title/i)).toHaveLength(0);
});
