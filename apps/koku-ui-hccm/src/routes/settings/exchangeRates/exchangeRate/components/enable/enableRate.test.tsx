import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import { EnableRate } from './enableRate';

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

function makeStore(status: FetchStatus, settingsType: SettingsType = SettingsType.currencyEnable, error?: unknown) {
  const fetchId = getFetchId(settingsType);
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

const currency = {
  code: 'USD',
  enabled: true,
  is_disableable: true,
} as any;

const renderEnable = (ui: React.ReactElement, store = makeStore(FetchStatus.none)) =>
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    </Provider>
  );

describe('EnableRate', () => {
  test('renders enabled switch', () => {
    renderEnable(<EnableRate canWrite settings={currency} />);
    expect(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i })).toBeChecked();
  });

  test('disables switch when canWrite is false', () => {
    renderEnable(<EnableRate canWrite={false} settings={currency} />);
    expect(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i })).toBeDisabled();
  });

  test('disables switch when currency is not disableable', () => {
    renderEnable(<EnableRate canWrite settings={{ ...currency, is_disableable: false }} />);
    expect(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i })).toBeDisabled();
  });

  test('invokes onEnable when isDispatch is false', () => {
    const onEnable = jest.fn();
    renderEnable(<EnableRate canWrite isDispatch={false} onEnable={onEnable} settings={currency} />);

    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));
    expect(onEnable).toHaveBeenCalledWith(false);
  });

  test('dispatches currency disable when toggling off', () => {
    const store = makeStore(FetchStatus.none, SettingsType.currencyEnable);
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderEnable(<EnableRate canWrite settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('invokes onEnable after successful dispatch completes', async () => {
    const onEnable = jest.fn();
    // After toggle off, isEnabled becomes false so selectors use currencyDisable
    const store = makeStore(FetchStatus.complete, SettingsType.currencyDisable);
    jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderEnable(<EnableRate canWrite onEnable={onEnable} settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    await waitFor(() => expect(onEnable).toHaveBeenCalledWith(false));
  });

  test('restores baseline when dispatch completes with an error', async () => {
    const onEnable = jest.fn();
    const store = makeStore(FetchStatus.complete, SettingsType.currencyDisable, new Error('fail'));
    jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderEnable(<EnableRate canWrite onEnable={onEnable} settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i })).toBeChecked();
    });
    expect(onEnable).not.toHaveBeenCalled();
  });
});
