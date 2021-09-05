import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import messages from 'locales/messages';
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

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

test('delete dialog closed', () => {
  const { queryAllByText } = renderUI({});
  expect(queryAllByText(/The following sources are assigned to/i)).toHaveLength(0);
  expect(queryAllByText(/This action will delete/i)).toHaveLength(0);
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
  const { getAllByText, queryAllByText } = renderUI(state);
  expect(queryAllByText(regExp(messages.CostModelsDelete))).toHaveLength(2);
  expect(queryAllByText(/This action will delete/i)).toHaveLength(1);
  expect(queryAllByText(/The following sources are assigned to/i)).toHaveLength(0);
  fireEvent.click(getAllByText(regExp(messages.CostModelsDelete))[1]);
  expect(getAllByText(regExp(messages.CostModelsDelete))[1].disabled).toBeTruthy();
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
  expect(queryAllByText(regExp(messages.CostModelsDelete))).toHaveLength(1);
  expect(queryAllByText(/This action will delete/i)).toHaveLength(0);
  expect(queryAllByText(/The following sources are assigned to/i)).toHaveLength(1);
  fireEvent.click(getByText(regExp(messages.Cancel)));
  expect(queryAllByText(regExp(messages.CostModelsDelete))).toHaveLength(0);
});
