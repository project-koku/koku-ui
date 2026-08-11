import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SettingsType } from 'api/settings';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsReducer, settingsStateKey } from 'store/settings';
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

function makeStore(
  entries: Array<{ settingsType: SettingsType; status: FetchStatus; error?: unknown }> = [
    { settingsType: SettingsType.currencyEnable, status: FetchStatus.none },
    { settingsType: SettingsType.currencyDisable, status: FetchStatus.none },
  ]
) {
  const errors = new Map();
  const status = new Map();
  for (const entry of entries) {
    const fetchId = getFetchId(entry.settingsType);
    errors.set(fetchId, entry.error ?? null);
    status.set(fetchId, entry.status);
  }
  return createStore(
    combineReducers({ [settingsStateKey]: settingsReducer }),
    {
      [settingsStateKey]: {
        byId: new Map(),
        errors,
        notification: new Map(),
        status,
      },
    },
    applyMiddleware(thunk)
  );
}

/** Drive request → complete for currency enable/disable thunks. */
function mockThunkLifecycle(
  store: ReturnType<typeof makeStore>,
  settingsType: SettingsType,
  options: { error?: Error } = {}
) {
  const fetchId = getFetchId(settingsType);
  const originalDispatch = store.dispatch.bind(store);

  return jest.spyOn(store, 'dispatch').mockImplementation((action: any) => {
    if (typeof action === 'function') {
      originalDispatch(settingsActions.updateCurrencySettingsRequest({ fetchId } as any));
      Promise.resolve().then(() => {
        if (options.error) {
          originalDispatch(
            settingsActions.updateCurrencySettingsFailure(options.error as any, { fetchId } as any)
          );
        } else {
          originalDispatch(settingsActions.updateCurrencySettingsSuccess({} as any, { fetchId } as any));
        }
      });
      return action;
    }
    return originalDispatch(action);
  });
}

const currency = {
  code: 'USD',
  enabled: true,
  is_disableable: true,
} as any;

const renderEnable = (ui: React.ReactElement, store = makeStore()) =>
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
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);

    renderEnable(<EnableRate canWrite settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('invokes onEnable after successful disable request completes', async () => {
    const onEnable = jest.fn();
    const store = makeStore();
    // After toggle off, selectors read currencyDisable status
    mockThunkLifecycle(store, SettingsType.currencyDisable);

    renderEnable(<EnableRate canWrite onEnable={onEnable} settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    await waitFor(() => expect(onEnable).toHaveBeenCalledWith(false));
  });

  test('restores baseline when disable request completes with an error', async () => {
    const onEnable = jest.fn();
    const store = makeStore();
    mockThunkLifecycle(store, SettingsType.currencyDisable, { error: new Error('fail') });

    renderEnable(<EnableRate canWrite onEnable={onEnable} settings={currency} />, store);
    fireEvent.click(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i }));

    await waitFor(() => {
      expect(screen.getByRole('switch', { name: /toggle currency enabled or disabled/i })).toBeChecked();
    });
    expect(onEnable).not.toHaveBeenCalled();
  });
});
