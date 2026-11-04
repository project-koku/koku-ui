import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FetchStatus } from 'store/common';

import messages from '../../../../../../../locales/translations.json';
import { AddRate } from './addRate';

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

jest.mock('./addRateModal', () => ({
  AddRateModal: ({
    isOpen,
    onAdd,
    onClose,
    settings,
  }: {
    isOpen?: boolean;
    onAdd?: (rate: unknown) => void;
    onClose?: () => void;
    settings?: unknown[];
  }) =>
    isOpen ? (
      <div data-testid="add-rate-modal-open" data-settings-count={settings?.length ?? 0}>
        <button type="button" onClick={onClose}>
          modal-close
        </button>
        <button type="button" onClick={() => onAdd?.({ uuid: 'new-rate' })}>
          modal-add
        </button>
      </div>
    ) : null,
}));

const noopStore = createStore(() => ({}));

const renderAddRate = (ui: React.ReactElement) =>
  render(
    <Provider store={noopStore}>
      <IntlProvider locale="en" messages={messages}>
        {ui}
      </IntlProvider>
    </Provider>
  );

describe('AddRate', () => {
  beforeEach(() => {
    mockSelectSettings.mockReturnValue({ data: [{ code: 'USD' }, { code: 'INR' }], meta: { count: 2 } });
    mockSelectSettingsError.mockReturnValue(undefined);
    mockSelectSettingsFetchStatus.mockReturnValue(FetchStatus.complete);
    mockFetchSettings.mockClear();
  });

  test('opens add modal when create button is clicked', () => {
    renderAddRate(<AddRate canWrite />);

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(screen.getByTestId('add-rate-modal-open')).toBeInTheDocument();
  });

  test('passes fetched settings data into the modal', () => {
    renderAddRate(<AddRate canWrite />);

    expect(mockFetchSettings).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(screen.getByTestId('add-rate-modal-open')).toHaveAttribute('data-settings-count', '2');
    expect(mockFetchSettings).toHaveBeenCalled();
  });

  test('refetches settings when the modal is opened again', () => {
    renderAddRate(<AddRate canWrite />);

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /modal-close/i }));
    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    expect(mockFetchSettings).toHaveBeenCalledTimes(2);
  });

  test('disables create button when canWrite is false', () => {
    renderAddRate(<AddRate canWrite={false} />);

    expect(screen.getByRole('button', { name: /create exchange rate/i })).toHaveAttribute('aria-disabled', 'true');
  });

  test('add and close callbacks close the modal', () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();
    renderAddRate(<AddRate canWrite onAdd={onAdd} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /modal-add/i }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'new-rate' }));
    expect(screen.queryByTestId('add-rate-modal-open')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /create exchange rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /modal-close/i }));
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByTestId('add-rate-modal-open')).not.toBeInTheDocument();
  });
});
