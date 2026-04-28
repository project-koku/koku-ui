import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { RateActions } from './rateActions';

jest.mock('routes/settings/priceList/components/editRate', () => ({
  EditRateModal: () => <div data-testid="edit-rate-modal-stub" />,
}));

jest.mock('routes/settings/priceList/components/deleteRate', () => ({
  DeleteRateModal: () => <div data-testid="delete-rate-modal-stub" />,
}));

jest.mock('routes/settings/priceList/components/confirmEditRate', () => ({
  ConfirmEditRateModal: () => <div data-testid="confirm-edit-modal-stub" />,
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
});
