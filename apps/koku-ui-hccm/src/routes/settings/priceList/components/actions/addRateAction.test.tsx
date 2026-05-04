import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { AddRateAction } from './addRateAction';

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

describe('AddRateAction', () => {
  const renderWithStore = (ui: React.ReactElement) =>
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );

  test('opens edit modal directly when price list has no assigned cost models', async () => {
    renderWithStore(
      <AddRateAction canWrite priceList={{ uuid: 'pl-1', assigned_cost_model_count: 0 } as any} />
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-stub')).toBeInTheDocument());
  });

  test('opens confirm modal first when price list is assigned to cost models', async () => {
    renderWithStore(
      <AddRateAction canWrite priceList={{ uuid: 'pl-2', assigned_cost_model_count: 2 } as any} />
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
  });

  test('confirm continue opens edit modal and finish flows invoke callbacks', async () => {
    const onClose = jest.fn();
    const onAddRate = jest.fn();
    renderWithStore(
      <AddRateAction
        canWrite
        onAddRate={onAddRate}
        onClose={onClose}
        priceList={{ uuid: 'pl-c', assigned_cost_model_count: 1 } as any}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /confirm-continue/i }));
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /edit-success/i }));
    await waitFor(() => expect(onAddRate).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(screen.getByTestId('confirm-edit-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /confirm-close/i }));
  });

  test('closing edit modal invokes onClose when provided', async () => {
    const onClose = jest.fn();
    renderWithStore(
      <AddRateAction canWrite onClose={onClose} priceList={{ uuid: 'pl-d', assigned_cost_model_count: 0 } as any} />
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(screen.getByTestId('edit-rate-modal-stub')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /edit-close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
