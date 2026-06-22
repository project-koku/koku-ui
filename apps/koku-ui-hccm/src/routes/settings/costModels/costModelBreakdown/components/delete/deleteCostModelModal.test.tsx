import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { DeleteCostModelModal } from './deleteCostModelModal';

jest.mock('./deleteCostModelContent', () => ({
  DeleteCostModelContent: React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ delete: () => _props.onDelete?.(_props.costModel) }));
    return <div data-testid="delete-content" />;
  }),
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, deleteCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

import * as api from 'api/costModels';

const costModel = { uuid: 'cm-1', name: 'Model', sources: [] } as any;

describe('DeleteCostModelModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('delete dispatches and calls onDelete', async () => {
    const onDelete = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <DeleteCostModelModal costModel={costModel} isOpen onDelete={onDelete} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /delete cost model/i }));
    await waitFor(() => expect(api.deleteCostModel).toHaveBeenCalledWith('cm-1'));
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(costModel));
  });
});
