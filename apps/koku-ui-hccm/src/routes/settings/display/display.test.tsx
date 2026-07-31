import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { AccountSettingsType } from 'api/accountSettings';
import { useAccountSettingsNotifications } from 'routes/settings/utils/hooks';
import { accountSettingsActions } from 'store/accountSettings';
import { configureStore } from 'store/store';

import { Display } from './display';

let mockIsSettingsDataRetentionPeriodEnabled = true;

jest.mock('components/featureToggle', () => ({
  get isSettingsDataRetentionPeriodEnabled() {
    return mockIsSettingsDataRetentionPeriodEnabled;
  },
}));

jest.mock('utils/sessionStorage', () => ({
  getAccountCostType: () => 'unblended',
  getAccountCurrency: () => 'USD',
}));

jest.mock('routes/settings/utils/hooks', () => ({
  useAccountSettingsNotifications: jest.fn(),
}));

jest.mock('store/accountSettings', () => {
  const actual = jest.requireActual('store/accountSettings');
  return {
    __esModule: true,
    ...actual,
    accountSettingsActions: {
      ...actual.accountSettingsActions,
      updateAccountSettings: jest.fn((type, payload) => ({
        type: 'accountSettings/update',
        meta: { accountSettingsType: type },
        payload,
      })),
    },
  };
});

jest.mock('routes/components/costType', () => ({
  CostType: ({
    costType,
    isDisabled,
    onSelect,
  }: {
    costType?: string;
    isDisabled?: boolean;
    onSelect?: (value: string) => void;
  }) => (
    <button
      data-testid="cost-type"
      data-disabled={String(!!isDisabled)}
      data-value={costType}
      onClick={() => onSelect?.('amortized')}
    />
  ),
}));

jest.mock('routes/components/currency', () => ({
  Currency: ({
    currency,
    isDisabled,
    onSelect,
  }: {
    currency?: string;
    isDisabled?: boolean;
    onSelect?: (value: string) => void;
  }) => (
    <button
      data-testid="currency"
      data-disabled={String(!!isDisabled)}
      data-value={currency}
      onClick={() => onSelect?.('EUR')}
    />
  ),
}));

jest.mock('./dataRetention', () => ({
  DataRetention: ({ isDisabled }: { isDisabled?: boolean }) => (
    <div data-testid="data-retention" data-disabled={String(!!isDisabled)} />
  ),
}));

describe('Display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSettingsDataRetentionPeriodEnabled = true;
  });

  const renderDisplay = (canWrite = true) => {
    const store = configureStore({});
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const view = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Display canWrite={canWrite} />
        </IntlProvider>
      </Provider>
    );
    return { ...view, store, dispatchSpy };
  };

  test('renders currency and cost type sections', () => {
    renderDisplay();
    expect(screen.getByTestId('currency')).toBeInTheDocument();
    expect(screen.getByTestId('cost-type')).toBeInTheDocument();
  });

  test('initializes cost type and currency from session storage', () => {
    renderDisplay();
    expect(screen.getByTestId('currency')).toHaveAttribute('data-value', 'USD');
    expect(screen.getByTestId('cost-type')).toHaveAttribute('data-value', 'unblended');
  });

  test('registers account settings notification hooks for cost type and currency', () => {
    renderDisplay();
    expect(useAccountSettingsNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AccountSettingsType.costType,
        getSessionValue: expect.any(Function),
        setState: expect.any(Function),
      })
    );
    expect(useAccountSettingsNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AccountSettingsType.currency,
        getSessionValue: expect.any(Function),
        setState: expect.any(Function),
      })
    );
  });

  test('renders data retention section when feature is enabled', () => {
    renderDisplay();
    expect(screen.getByText(/data retention period/i)).toBeInTheDocument();
    expect(screen.getByTestId('data-retention')).toBeInTheDocument();
  });

  test('hides data retention section when feature is disabled', () => {
    mockIsSettingsDataRetentionPeriodEnabled = false;
    renderDisplay();
    expect(screen.queryByText(/data retention period/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('data-retention')).not.toBeInTheDocument();
  });

  test('disables data retention when canWrite is false', () => {
    renderDisplay(false);
    expect(screen.getByTestId('data-retention')).toHaveAttribute('data-disabled', 'true');
  });

  test('enables data retention when canWrite is true', () => {
    renderDisplay(true);
    expect(screen.getByTestId('data-retention')).toHaveAttribute('data-disabled', 'false');
  });

  test('disables cost type and currency when canWrite is false', () => {
    renderDisplay(false);
    expect(screen.getByTestId('cost-type')).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByTestId('currency')).toHaveAttribute('data-disabled', 'true');
  });

  test('dispatches cost type update when cost type is selected', () => {
    const { dispatchSpy } = renderDisplay();
    fireEvent.click(screen.getByTestId('cost-type'));
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.costType, {
      cost_type: 'amortized',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('dispatches currency update when currency is selected', () => {
    const { dispatchSpy } = renderDisplay();
    fireEvent.click(screen.getByTestId('currency'));
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.currency, {
      currency: 'EUR',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
