import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { EditCostModelModal } from './editCostModelModal';

jest.mock('./editCostModelContent', () => ({
  EditCostModelContent: React.forwardRef((_props: any, ref: any) => {
    React.useEffect(() => _props.onDisabled?.(false), [_props.onDisabled]);
    React.useImperativeHandle(ref, () => ({
      save: () => _props.onSave?.({ ..._props.costModel, name: 'Updated' }),
    }));
    return <div data-testid="edit-content" />;
  }),
}));

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

import * as api from 'api/costModels';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  sources: [],
} as any;

describe('EditCostModelModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('save dispatches update', async () => {
    const onSave = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <EditCostModelModal costModel={costModel} isOpen onSave={onSave} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^save$/i }));
    await waitFor(() => expect(api.updateCostModel).toHaveBeenCalled());
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });
});
