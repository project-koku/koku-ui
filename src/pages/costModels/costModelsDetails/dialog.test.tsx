import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  renderUI({});
  expect(screen.queryAllByText(/The following sources are assigned to/i)).toHaveLength(0);
  expect(screen.queryAllByText(/This action will delete/i)).toHaveLength(0);
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
  renderUI(state);
  expect(screen.queryAllByText(regExp(messages.costModelsDelete))).toHaveLength(2);
  expect(screen.queryAllByText(/This action will delete/i)).toHaveLength(1);
  expect(screen.queryAllByText(/The following sources are assigned to/i)).toHaveLength(0);
  userEvent.click(screen.getAllByText(regExp(messages.costModelsDelete))[1]);
  expect(screen.getAllByText(regExp(messages.costModelsDelete))[1].getAttribute('disabled')).not.toBeNull();
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
  renderUI(state);
  expect(screen.queryAllByText(regExp(messages.costModelsDelete))).toHaveLength(1);
  expect(screen.queryAllByText(/This action will delete/i)).toHaveLength(0);
  expect(screen.queryAllByText(/The following sources are assigned to/i)).toHaveLength(1);
  userEvent.click(screen.getByText(regExp(messages.cancel)));
  expect(screen.queryAllByText(regExp(messages.costModelsDelete))).toHaveLength(0);
});
