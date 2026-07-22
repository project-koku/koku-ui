import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { AccountSettingsType } from 'api/accountSettings';
import { FetchStatus } from 'store/common';
import { accountSettingsStateKey } from 'store/accountSettings';
import { getFetchId } from 'store/accountSettings/accountSettingsCommon';
import { configureStore } from 'store/store';

import { DataRetention } from './dataRetention';
import { DateRangeType } from './components';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => jest.fn(),
}));

jest.mock('components/featureToggle', () => ({
  isSettingsDataRetentionPeriodEnabled: true,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available">Not available</div>,
}));

jest.mock('./components', () => {
  const actual = jest.requireActual('./components');
  return {
    ...actual,
    DateRange: ({
      dateRangeType,
      isDisabled,
      onSelect,
    }: {
      dateRangeType?: string;
      isDisabled?: boolean;
      onSelect?: (value: string) => void;
    }) => (
      <div data-testid="date-range" data-date-range-type={dateRangeType} data-disabled={String(!!isDisabled)}>
        <button type="button" data-testid="select-six-months" onClick={() => onSelect?.(actual.DateRangeType.sixMonths)}>
          6 months
        </button>
        <button type="button" data-testid="select-custom" onClick={() => onSelect?.(actual.DateRangeType.custom)}>
          Custom
        </button>
      </div>
    ),
    CustomDateRange: ({
      inputValue,
      isDisabled,
      onUpdate,
    }: {
      inputValue?: number;
      isDisabled?: boolean;
      onUpdate?: (value: number) => void;
    }) => (
      <div data-testid="custom-date-range" data-value={inputValue} data-disabled={String(!!isDisabled)}>
        <button type="button" data-testid="custom-update" onClick={() => onUpdate?.(90)}>
          Update
        </button>
      </div>
    ),
  };
});

jest.mock('store/accountSettings/accountSettingsActions', () => {
  const actual = jest.requireActual('store/accountSettings/accountSettingsActions');
  return {
    ...actual,
    fetchAccountSettings: jest.fn(() => () => undefined),
    updateAccountSettings: jest.fn(() => () => undefined),
  };
});

import * as accountSettingsActions from 'store/accountSettings/accountSettingsActions';

describe('DataRetention', () => {
  const fetchId = getFetchId(AccountSettingsType.dataRetention);
  const defaultSettings = { data_retention_months: 3, env_override: false };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDataRetention = (
    status: FetchStatus,
    error: unknown = null,
    data: unknown = defaultSettings,
    isDisabled = false
  ) => {
    const store = configureStore({
      [accountSettingsStateKey]: {
        byId: new Map([[fetchId, data]]),
        errors: new Map([[fetchId, error]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    } as any);

    return render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DataRetention isDisabled={isDisabled} />
        </IntlProvider>
      </Provider>
    );
  };

  test('renders loading state while fetch is in progress', () => {
    renderDataRetention(FetchStatus.inProgress);
    expect(screen.getByText(/looking for data retention period/i)).toBeInTheDocument();
  });

  test('renders NotAvailable when fetch fails', () => {
    renderDataRetention(FetchStatus.complete, { message: 'error' });
    expect(screen.getByTestId('not-available')).toBeInTheDocument();
  });

  test('renders date range with last three months by default', () => {
    renderDataRetention(FetchStatus.complete);
    expect(screen.getByTestId('date-range')).toHaveAttribute('data-date-range-type', DateRangeType.threeMonths);
    expect(screen.queryByTestId('custom-date-range')).not.toBeInTheDocument();
  });

  test('updates retention period and dispatches when a preset range is selected', () => {
    renderDataRetention(FetchStatus.complete);
    fireEvent.click(screen.getByTestId('select-six-months'));
    expect(screen.getByTestId('date-range')).toHaveAttribute('data-date-range-type', DateRangeType.sixMonths);
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.dataRetention, {
      data_retention_months: 6,
    });
  });

  test('shows custom date range when custom is selected', () => {
    renderDataRetention(FetchStatus.complete);
    fireEvent.click(screen.getByTestId('select-custom'));
    expect(screen.getByTestId('date-range')).toHaveAttribute('data-date-range-type', DateRangeType.custom);
    expect(screen.getByTestId('custom-date-range')).toBeInTheDocument();
  });

  test('dispatches update when custom date range value changes', () => {
    renderDataRetention(FetchStatus.complete);
    fireEvent.click(screen.getByTestId('select-custom'));
    fireEvent.click(screen.getByTestId('custom-update'));
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.dataRetention, {
      data_retention_months: 90,
    });
  });

  test('passes isDisabled to date range controls', () => {
    renderDataRetention(FetchStatus.complete, null, defaultSettings, true);
    expect(screen.getByTestId('date-range')).toHaveAttribute('data-disabled', 'true');
  });

  test('disables controls and wraps in tooltip when env_override is true', () => {
    renderDataRetention(FetchStatus.complete, null, { data_retention_months: 3, env_override: true });
    expect(screen.getByTestId('date-range')).toHaveAttribute('data-disabled', 'true');
  });
});
