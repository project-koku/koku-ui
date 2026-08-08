import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsType } from 'api/settings';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { settingsReducer, settingsStateKey } from 'store/settings';
import { getFetchId } from 'store/settings/settingsCommon';

import messages from '../../../../../../../locales/translations.json';
import { EditRateModal } from './editRateModal';

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: { formatMessage: (m: { id?: string; defaultMessage?: string }) => m?.defaultMessage || m?.id || 'msg' },
}));

jest.mock('api/settings', () => {
  const actual = jest.requireActual('api/settings');
  return {
    ...actual,
    updateCurrencySettings: jest.fn(() => Promise.resolve({ data: {} })),
  };
});

const ratePayload = {
  base_currency: 'USD',
  target_currency: 'EUR',
  exchange_rate: 1.25,
  start_date: '2026-08-01',
  end_date: '2026-08-31',
};

jest.mock('../rateContent', () => {
  const React = require('react');
  return {
    RateContent: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        save: () => props.onSave?.(ratePayload),
      }));
      React.useLayoutEffect(() => {
        props.onDisabled?.(false);
      });
      return <div data-testid="rate-content-mock" />;
    }),
  };
});

function makeStoreWithUpdateStatus(status: FetchStatus, error?: unknown) {
  const fetchId = getFetchId(SettingsType.currencyEdit);
  return createStore(
    combineReducers({ [settingsStateKey]: settingsReducer }),
    {
      [settingsStateKey]: {
        byId: new Map(),
        errors: new Map([[fetchId, error ?? null]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    },
    applyMiddleware(thunk)
  );
}

const renderModal = (ui: React.ReactElement, store = makeStoreWithUpdateStatus(FetchStatus.none)) =>
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    </Provider>
  );

describe('EditRateModal', () => {
  test('invokes onEdit when save is clicked and isDispatch is false', () => {
    const onEdit = jest.fn();
    renderModal(<EditRateModal isDispatch={false} isOpen onEdit={onEdit} uuid="rate-1" />);

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining(ratePayload));
  });

  test('dispatches currency edit when isDispatch is true', () => {
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    // Avoid running the async thunk (prevents act warnings from late store updates)
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderModal(<EditRateModal isOpen uuid="rate-1" />, store);
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('invokes onEdit after successful dispatch completes', async () => {
    const onEdit = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete);
    jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderModal(<EditRateModal isOpen onEdit={onEdit} uuid="rate-1" />, store);

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => expect(onEdit).toHaveBeenCalledWith(expect.objectContaining(ratePayload)));
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    renderModal(<EditRateModal isOpen onClose={onClose} uuid="rate-1" />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('primary button disabled while update in progress', () => {
    renderModal(<EditRateModal isOpen uuid="rate-1" />, makeStoreWithUpdateStatus(FetchStatus.inProgress));

    expect(screen.getByRole('button', { name: /^save$/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
