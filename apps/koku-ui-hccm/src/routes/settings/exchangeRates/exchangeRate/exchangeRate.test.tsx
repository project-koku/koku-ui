import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';

import messages from '../../../../../locales/translations.json';

const mockSelectSettings = jest.fn();
const mockSelectSettingsError = jest.fn();
const mockSelectSettingsFetchStatus = jest.fn();
const mockFetchSettings = jest.fn(() => ({ type: 'MOCK_FETCH_SETTINGS' }));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

jest.mock('store/settings', () => {
  const actual = jest.requireActual('store/settings');
  return {
    ...actual,
    settingsActions: {
      ...actual.settingsActions,
      fetchSettings: (...args: unknown[]) => mockFetchSettings(...args),
    },
    settingsSelectors: {
      ...actual.settingsSelectors,
      selectSettings: (...args: unknown[]) => mockSelectSettings(...args),
      selectSettingsError: (...args: unknown[]) => mockSelectSettingsError(...args),
      selectSettingsFetchStatus: (...args: unknown[]) => mockSelectSettingsFetchStatus(...args),
    },
  };
});

jest.mock('routes/settings/utils', () => ({
  useAccountSettingsNotifications: () => undefined,
  useSettingsNotifications: () => undefined,
}));

jest.mock('routes/settings/utils/filterBy', () => ({
  getFilterValuesById: () => undefined,
}));

jest.mock('./exchangeRateTable', () => ({
  ExchangeRateTable: ({
    onDelete,
    onDuplicate,
    onEdit,
    onEnable,
  }: {
    onDelete?: () => void;
    onDuplicate?: () => void;
    onEdit?: () => void;
    onEnable?: () => void;
  }) => (
    <div data-testid="exchange-rate-table">
      <button type="button" onClick={() => onDelete?.()}>
        table-delete
      </button>
      <button type="button" onClick={() => onDuplicate?.()}>
        table-duplicate
      </button>
      <button type="button" onClick={() => onEdit?.()}>
        table-edit
      </button>
      <button type="button" onClick={() => onEnable?.()}>
        table-enable
      </button>
    </div>
  ),
}));

jest.mock('./exchangeRateToolbar', () => ({
  ExchangeRateToolbar: ({
    onAdd,
    onCurrency,
    onFilterAdded,
    onFilterRemoved,
    onShowDeprecated,
    pagination,
  }: {
    onAdd?: () => void;
    onCurrency?: () => void;
    onFilterAdded?: (f: { type?: string; value?: string }) => void;
    onFilterRemoved?: (f: { type?: string; value?: string }) => void;
    onShowDeprecated?: (checked: boolean) => void;
    pagination?: React.ReactNode;
  }) => (
    <div data-testid="exchange-rate-toolbar">
      <button type="button" onClick={() => onAdd?.()}>
        toolbar-add
      </button>
      <button type="button" onClick={() => onCurrency?.()}>
        toolbar-currency
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'currency', value: 'USD' })}>
        toolbar-filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'currency', value: 'USD' })}>
        toolbar-filter-remove
      </button>
      <button type="button" onClick={() => onShowDeprecated?.(true)}>
        toolbar-show-disabled
      </button>
      {pagination}
    </div>
  ),
}));

jest.mock('./components/state', () => ({
  NoExchangeRateState: () => <div data-testid="no-exchange-rate-state" />,
  NoExchangeRateAssignedState: () => <div data-testid="no-exchange-rate-assigned-state" />,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available" />,
}));

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: ({ heading }: { heading?: string }) => <div data-testid="loading-state">{heading}</div>,
}));

import { ExchangeRate } from './exchangeRate';

const noopStore = createStore(() => ({}));

const renderPage = (ui: React.ReactElement) =>
  render(
    <Provider store={noopStore}>
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    </Provider>
  );

describe('ExchangeRate', () => {
  beforeEach(() => {
    mockSelectSettings.mockReset();
    mockSelectSettingsError.mockReset();
    mockSelectSettingsFetchStatus.mockReset();
    mockFetchSettings.mockClear();
    mockSelectSettings.mockReturnValue(undefined);
    mockSelectSettingsError.mockReturnValue(undefined);
    mockSelectSettingsFetchStatus.mockReturnValue(FetchStatus.complete);
  });

  test('shows not available when settings fetch errors', () => {
    mockSelectSettingsError.mockReturnValue(new Error('network'));
    renderPage(<ExchangeRate canWrite />);
    expect(screen.getByTestId('not-available')).toBeInTheDocument();
  });

  test('shows loading state while fetch is in progress', () => {
    mockSelectSettingsFetchStatus.mockReturnValue(FetchStatus.inProgress);
    mockSelectSettings.mockReturnValue({ data: [{ code: 'USD' }], meta: { count: 1, limit: 10, offset: 0 } });
    renderPage(<ExchangeRate canWrite />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('shows empty state when there are no currencies', () => {
    mockSelectSettings.mockReturnValue({ data: [], meta: { count: 0, limit: 10, offset: 0 } });
    renderPage(<ExchangeRate canWrite />);
    expect(screen.getByTestId('no-exchange-rate-state')).toBeInTheDocument();
    expect(screen.getByTestId('exchange-rate-toolbar')).toBeInTheDocument();
  });

  test('shows assigned empty state when show disabled is toggled with an empty list', () => {
    mockSelectSettings.mockReturnValue({ data: [], meta: { count: 0, limit: 10, offset: 0 } });
    renderPage(<ExchangeRate canWrite />);
    expect(screen.getByTestId('no-exchange-rate-state')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /toolbar-show-disabled/i }));
    expect(screen.getByTestId('no-exchange-rate-assigned-state')).toBeInTheDocument();
  });

  test('renders table when currencies exist and handles toolbar/table callbacks', () => {
    mockSelectSettings.mockReturnValue({
      data: [{ code: 'USD', enabled: true, static_rates: [] }],
      meta: { count: 20, limit: 10, offset: 0 },
    });
    renderPage(<ExchangeRate canWrite />);

    expect(screen.getByTestId('exchange-rate-table')).toBeInTheDocument();
    expect(screen.getByTestId('exchange-rate-toolbar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /toolbar-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-currency/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-duplicate/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /table-enable/i }));
  });
});
