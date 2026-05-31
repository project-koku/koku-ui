import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { EditCostModel, type EditCostModelHandle } from './editCostModel';

jest.mock('./editCostModelModal', () => ({
  EditCostModelModal: ({ isOpen }: any) => (isOpen ? <div data-testid="edit-modal-open" /> : null),
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('EditCostModel', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('open ref shows modal', () => {
    const ref = createRef<EditCostModelHandle>();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <EditCostModel costModel={costModel} onSave={jest.fn()} ref={ref} />
        </IntlProvider>
      </Provider>
    );
    act(() => ref.current?.open());
    expect(screen.getByTestId('edit-modal-open')).toBeInTheDocument();
  });
});
