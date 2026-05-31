import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';

import { MarkupModal } from './markupModal';

jest.mock('api/costModels', () => {
  const actual = jest.requireActual('api/costModels');
  return { ...actual, updateCostModel: jest.fn(() => Promise.resolve({ data: {} })) };
});

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  source_type: 'OpenShift Container Platform',
  markup: { value: '10', unit: 'percent' },
} as any;

describe('MarkupModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [costModelsStateKey]: costModelsReducer }), applyMiddleware(thunk));

  test('renders and closes on cancel', () => {
    const onClose = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <MarkupModal canWrite costModel={costModel} isOpen onClose={onClose} onSave={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('save without dispatch calls onSave', () => {
    const onSave = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <MarkupModal canWrite costModel={costModel} isDispatch={false} isOpen onClose={jest.fn()} onSave={onSave} />
        </IntlProvider>
      </Provider>
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(/rate/i), { target: { value: '15' } });
    fireEvent.click(dialog.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalled();
  });

  test('discount radio and keydown handlers update state', () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <MarkupModal canWrite costModel={costModel} isDispatch={false} isOpen onClose={jest.fn()} onSave={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.click(dialog.getByLabelText(/discount/i));
    const input = dialog.getByLabelText(/rate/i);
    fireEvent.keyDown(input, { keyCode: 13 });
    fireEvent.change(input, { target: { value: 'not-a-number' } });
    expect(dialog.getByText(/must be a number/i)).toBeInTheDocument();
  });
});
