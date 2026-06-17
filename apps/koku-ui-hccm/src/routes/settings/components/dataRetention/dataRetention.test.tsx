import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { DataRetentionType } from 'api/dataRetention';
import { FetchStatus } from 'store/common';
import { dataRetentionStateKey } from 'store/dataRetention';
import { getFetchId } from 'store/dataRetention/dataRetentionCommon';
import { configureStore } from 'store/store';

import { DataRetention } from './dataRetention';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => jest.fn(),
}));

jest.mock('components/featureToggle', () => ({
  isSettingsDataRetentionPeriodEnabled: true,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available">Not available</div>,
}));

jest.mock('store/dataRetention/dataRetentionActions', () => {
  const actual = jest.requireActual('store/dataRetention/dataRetentionActions');
  return {
    ...actual,
    fetchDataRetention: jest.fn(() => () => undefined),
    updateDataRetention: jest.fn(() => () => undefined),
  };
});

describe('DataRetention', () => {
  const fetchId = getFetchId(DataRetentionType.dataRetention, '');

  const renderDataRetention = (status: FetchStatus, error: any = null, data: any = { data: [], meta: { count: 0 } }) => {
    const store = configureStore({
      [dataRetentionStateKey]: {
        byId: new Map([[fetchId, data]]),
        errors: new Map([[fetchId, error]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    } as any);

    return render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DataRetention />
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

  test('renders NumberInput when fetch completes successfully', () => {
    renderDataRetention(FetchStatus.complete);
    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toBeInTheDocument();
  });

  test('clamps value to min on blur', () => {
    renderDataRetention(FetchStatus.complete);
    const input = screen.getByRole('spinbutton', { name: /data retention period number input/i });
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(90);
  });

  test('clamps value to max on blur', () => {
    renderDataRetention(FetchStatus.complete);
    const input = screen.getByRole('spinbutton', { name: /data retention period number input/i });
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(120);
  });

  test('disables NumberInput when isDisabled is true', () => {
    const store = configureStore({
      [dataRetentionStateKey]: {
        byId: new Map([[fetchId, { data: [], meta: { count: 0 } }]]),
        errors: new Map([[fetchId, null]]),
        notification: new Map(),
        status: new Map([[fetchId, FetchStatus.complete]]),
      },
    } as any);

    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <DataRetention isDisabled />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toBeDisabled();
  });
});
