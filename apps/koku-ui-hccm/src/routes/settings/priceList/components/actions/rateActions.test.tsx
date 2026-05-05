import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { RateActions } from './rateActions';

jest.mock('routes/settings/priceList/components/editRate', () => ({
  EditRateModal: ({
    isOpen,
    onClose,
    onUpdateSuccess,
  }: {
    isOpen?: boolean;
    onClose?: () => void;
    onUpdateSuccess?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="edit-rate-modal-stub">
        <button type="button" onClick={onClose}>
          edit-close
        </button>
        <button type="button" onClick={onUpdateSuccess}>
          edit-success
        </button>
      </div>
    ) : null,
}));

jest.mock('routes/settings/priceList/components/deleteRate', () => ({
  DeleteRateModal: ({
    isOpen,
    onClose,
    onUpdateSuccess,
  }: {
    isOpen?: boolean;
    onClose?: () => void;
    onUpdateSuccess?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="delete-rate-modal-stub">
        <button type="button" onClick={onClose}>
          delete-close
        </button>
        <button type="button" onClick={onUpdateSuccess}>
          delete-success
        </button>
      </div>
    ) : null,
}));

jest.mock('routes/settings/priceList/components/confirmEditRate', () => ({
  ConfirmEditRateModal: ({
    isOpen,
    onClose,
    onContinue,
  }: {
    isOpen?: boolean;
    onClose?: () => void;
    onContinue?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="confirm-edit-modal-stub">
        <button type="button" onClick={onClose}>
          confirm-close
        </button>
        <button type="button" onClick={onContinue}>
          confirm-continue
        </button>
      </div>
    ) : null,
}));

describe('RateActions', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const renderWithStore = (ui: React.ReactElement) =>
    render(
      <Provider store={setupStore()}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );

  const baseProps = {
    canWrite: true,
    isDisabled: false,
    onClose: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    priceList: { uuid: 'pl-1', name: 'PL' } as any,
    rateIndex: 0,
  };

  test('opens kebab and surfaces edit + delete menu items', async () => {
    renderWithStore(<RateActions {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    expect(await screen.findByRole('menuitem', { name: /edit rate/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^delete$/i })).toBeInTheDocument();
  });

  test('edit flow without assigned cost models opens edit modal via direct handler', async () => {
    renderWithStore(<RateActions {...baseProps} priceList={{ ...baseProps.priceList, assigned_cost_model_count: 0 }} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-stub')).toBeInTheDocument());
  });

  test('edit flow with assigned cost models uses confirm modal before edit', async () => {
    renderWithStore(
      <RateActions {...baseProps} priceList={{ ...baseProps.priceList, assigned_cost_model_count: 2 }} />
    );
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
  });

  test('delete opens delete modal', async () => {
    renderWithStore(<RateActions {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^delete$/i }));
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-stub')).toBeInTheDocument());
  });

  test('confirm-continue and modal close/success paths invoke parent callbacks', async () => {
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderWithStore(
      <RateActions
        {...baseProps}
        onClose={onClose}
        onDelete={onDelete}
        onEdit={onEdit}
        priceList={{ ...baseProps.priceList, assigned_cost_model_count: 2 }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /confirm-continue/i }));
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /edit-success/i }));
    expect(onEdit).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^delete$/i }));
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /delete-success/i }));
    expect(onDelete).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /edit rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /confirm-close/i }));
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^delete$/i }));
    await waitFor(() => expect(screen.getByTestId('delete-rate-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /delete-close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
