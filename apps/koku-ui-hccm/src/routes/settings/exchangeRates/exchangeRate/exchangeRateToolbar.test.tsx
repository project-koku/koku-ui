import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AccountSettingsType } from 'api/accountSettings';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { accountSettingsActions, accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
import { getFetchId } from 'store/accountSettings/accountSettingsCommon';
import { FetchStatus } from 'store/common';

import messages from '../../../../../locales/translations.json';
import { ExchangeRateToolbar } from './exchangeRateToolbar';

jest.mock('./components/add', () => ({
  AddRate: ({ canWrite }: { canWrite?: boolean }) => (
    <button type="button" aria-disabled={!canWrite ? 'true' : undefined}>
      Create exchange rate
    </button>
  ),
}));

jest.mock('routes/components/currency', () => ({
  Currency: ({ onSelect, isDisabled }: { onSelect?: (value: string) => void; isDisabled?: boolean }) => (
    <button type="button" disabled={isDisabled} onClick={() => onSelect?.('EUR')}>
      currency-select
    </button>
  ),
}));

jest.mock('routes/components/dataToolbar', () => ({
  BasicToolbar: ({ actions }: { actions?: React.ReactNode }) => <div data-testid="basic-toolbar">{actions}</div>,
}));

jest.mock('utils/sessionStorage', () => ({
  getAccountCurrency: () => 'USD',
}));

function makeStore(status: FetchStatus = FetchStatus.none, error?: unknown) {
  const fetchId = getFetchId(AccountSettingsType.currency);
  return createStore(
    combineReducers({ [accountSettingsStateKey]: accountSettingsReducer }),
    {
      [accountSettingsStateKey]: {
        byId: new Map(),
        errors: new Map([[fetchId, error ?? null]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    },
    applyMiddleware(thunk)
  );
}

/** Drive request → complete for thunk dispatches (models the real async update lifecycle). */
function mockThunkLifecycle(
  store: ReturnType<typeof makeStore>,
  options: { error?: Error } = {}
) {
  const fetchId = getFetchId(AccountSettingsType.currency);
  const originalDispatch = store.dispatch.bind(store);

  return jest.spyOn(store, 'dispatch').mockImplementation((action: any) => {
    if (typeof action === 'function') {
      originalDispatch(accountSettingsActions.updateAccountSettingsRequest({ fetchId } as any));
      Promise.resolve().then(() => {
        if (options.error) {
          originalDispatch(
            accountSettingsActions.updateAccountSettingsFailure(options.error as any, { fetchId } as any)
          );
        } else {
          originalDispatch(
            accountSettingsActions.updateAccountSettingsSuccess({} as any, { fetchId } as any)
          );
        }
      });
      return action;
    }
    return originalDispatch(action);
  });
}

describe('ExchangeRateToolbar', () => {
  const noop = jest.fn();
  const baseQuery = { filter_by: {}, limit: 10, offset: 0 } as any;

  const renderToolbar = (ui: React.ReactElement, store = makeStore()) =>
    render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={messages}>
          {ui}
        </IntlProvider>
      </Provider>
    );

  beforeEach(() => {
    noop.mockClear();
  });

  test('renders show disabled switch and create action when writable', () => {
    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />
    );

    expect(screen.getByRole('switch', { name: /show disabled/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create exchange rate/i })).toBeInTheDocument();
    expect(screen.getByText(/display default currency/i)).toBeInTheDocument();
  });

  test('disables create action when not writable', () => {
    renderToolbar(
      <ExchangeRateToolbar
        canWrite={false}
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />
    );

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toHaveAttribute('aria-disabled', 'true');
  });

  test('invokes onShowDeprecated when show disabled is toggled', () => {
    const onShowDeprecated = jest.fn();
    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={onShowDeprecated}
        query={baseQuery}
      />
    );

    fireEvent.click(screen.getByRole('switch', { name: /show disabled/i }));
    expect(onShowDeprecated).toHaveBeenCalledWith(true);
  });

  test('dispatches account currency update and calls onCurrency after request completes', async () => {
    const onCurrency = jest.fn();
    const store = makeStore(FetchStatus.none);
    const dispatchSpy = mockThunkLifecycle(store);

    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onCurrency={onCurrency}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />,
      store
    );

    fireEvent.click(screen.getByRole('button', { name: /currency-select/i }));
    expect(dispatchSpy).toHaveBeenCalled();
    await waitFor(() => expect(onCurrency).toHaveBeenCalled());
  });

  test('does not call onCurrency when account currency update fails', async () => {
    const onCurrency = jest.fn();
    const store = makeStore(FetchStatus.none);
    mockThunkLifecycle(store, { error: new Error('fail') });

    renderToolbar(
      <ExchangeRateToolbar
        canWrite
        isDisabled={false}
        isShowDisabled={false}
        itemsPerPage={10}
        itemsTotal={1}
        onCurrency={onCurrency}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        onShowDeprecated={noop}
        query={baseQuery}
      />,
      store
    );

    fireEvent.click(screen.getByRole('button', { name: /currency-select/i }));
    await waitFor(() => {
      const fetchId = getFetchId(AccountSettingsType.currency);
      expect(store.getState()[accountSettingsStateKey].status.get(fetchId)).toBe(FetchStatus.complete);
    });
    expect(onCurrency).not.toHaveBeenCalled();
  });
});
