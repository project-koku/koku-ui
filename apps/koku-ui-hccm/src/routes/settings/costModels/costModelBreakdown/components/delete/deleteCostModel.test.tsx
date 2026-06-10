import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { DeleteCostModel, type DeleteCostModelHandle } from './deleteCostModel';

jest.mock('./deleteCostModelModal', () => ({
  DeleteCostModelModal: ({ isOpen }: any) => (isOpen ? <div data-testid="delete-modal-open" /> : null),
}));

const costModel = { uuid: 'cm-1', name: 'Model', sources: [] } as any;

describe('DeleteCostModel', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('open ref shows modal', () => {
    const ref = createRef<DeleteCostModelHandle>();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DeleteCostModel costModel={costModel} onDelete={jest.fn()} ref={ref} />
        </IntlProvider>
      </Provider>
    );
    act(() => ref.current?.open());
    expect(screen.getByTestId('delete-modal-open')).toBeInTheDocument();
  });
});
