import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { AddRateAction } from './addRateAction';

jest.mock('routes/settings/priceList/components/editRate', () => ({
  EditRateModal: () => <div data-testid="edit-rate-modal-stub" />,
}));

jest.mock('routes/settings/priceList/components/confirmEditRate', () => ({
  ConfirmEditRateModal: () => <div data-testid="confirm-edit-modal-stub" />,
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
});
