import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { Display } from './display';

const mockUseIsOrgAdmin = jest.fn(() => false);
let mockIsSettingsDataRetentionPeriodEnabled = true;

jest.mock('components/featureToggle', () => ({
  get isSettingsDataRetentionPeriodEnabled() {
    return mockIsSettingsDataRetentionPeriodEnabled;
  },
  useIsOrgAdmin: () => mockUseIsOrgAdmin(),
}));

jest.mock('utils/sessionStorage', () => ({
  getAccountCostType: () => 'unblended',
  getAccountCurrency: () => 'USD',
}));

jest.mock('routes/settings/utils/hooks', () => ({
  useAccountSettingsNotifications: jest.fn(),
}));

jest.mock('routes/components/costType', () => ({
  CostType: () => <div data-testid="cost-type" />,
}));

jest.mock('routes/components/currency', () => ({
  Currency: () => <div data-testid="currency" />,
}));

jest.mock('routes/settings/components/dataRetention', () => ({
  DataRetention: ({ isDisabled }: { isDisabled?: boolean }) => (
    <div data-testid="data-retention" data-disabled={String(!!isDisabled)} />
  ),
}));

describe('Display', () => {
  beforeEach(() => {
    mockUseIsOrgAdmin.mockReturnValue(false);
    mockIsSettingsDataRetentionPeriodEnabled = true;
  });

  const renderDisplay = (canWrite = true) => {
    const store = configureStore({});
    return render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Display canWrite={canWrite} />
        </IntlProvider>
      </Provider>
    );
  };

  test('renders currency and cost type sections', () => {
    renderDisplay();
    expect(screen.getByTestId('currency')).toBeInTheDocument();
    expect(screen.getByTestId('cost-type')).toBeInTheDocument();
  });

  test('renders data retention section when feature is enabled', () => {
    renderDisplay();
    expect(screen.getByText(/data retention period/i)).toBeInTheDocument();
    expect(screen.getByTestId('data-retention')).toBeInTheDocument();
  });

  test('disables data retention for non-org-admin users', () => {
    mockUseIsOrgAdmin.mockReturnValue(false);
    renderDisplay();
    expect(screen.getByTestId('data-retention')).toHaveAttribute('data-disabled', 'true');
  });

  test('enables data retention for org admin users', () => {
    mockUseIsOrgAdmin.mockReturnValue(true);
    renderDisplay();
    expect(screen.getByTestId('data-retention')).toHaveAttribute('data-disabled', 'false');
  });

  test('hides data retention section when feature is disabled', () => {
    mockIsSettingsDataRetentionPeriodEnabled = false;
    renderDisplay();
    expect(screen.queryByTestId('data-retention')).not.toBeInTheDocument();
  });
});
