import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createStore } from 'redux';
import { FetchStatus } from '../../../../store/common';
import type { RootState } from '../../../../store/rootReducer';
import { rootReducer } from '../../../../store/rootReducer';

import DeleteDialog from './dialog';

const renderUI = (state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <DeleteDialog />,
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

test('delete dialog closed', () => {
  renderUI({});
  expect(screen.queryAllByText(/The following sources are assigned to/i)).toHaveLength(0);
  expect(screen.queryAllByText(/This action will delete/i)).toHaveLength(0);
});

test('delete dialog open', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
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
  expect(screen.getAllByRole('button', { name: regExp(messages.costModelsDelete)})).toHaveLength(1);
  expect(screen.queryAllByText(/This action will delete/i)).toHaveLength(1);
  expect(screen.queryAllByText(/The following integrations are assigned to/i)).toHaveLength(0);
  await act(async () => user.click(screen.getAllByRole('button', { name: regExp(messages.costModelsDelete)})[0]));
  expect(screen.getAllByRole('button', { name: regExp(messages.costModelsDelete)})[0].getAttribute('disabled')).not.toBeNull();
});

test('delete dialog error', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
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
  expect(screen.queryAllByText(/The following integrations are assigned to/i)).toHaveLength(1);
  await act(async () => user.click(screen.getByText(regExp(messages.cancel))));
  expect(screen.queryAllByText(regExp(messages.costModelsDelete))).toHaveLength(0);
});
