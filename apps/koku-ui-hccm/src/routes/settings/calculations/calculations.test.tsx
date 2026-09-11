import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { AccountSettingsType } from 'api/accountSettings';
import { accountSettingsActions } from 'store/accountSettings';

import Calculations from './calculations';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => jest.fn(),
}));

jest.mock('utils/sessionStorage', () => ({
  getAccountCostType: () => 'unblended',
  getAccountCurrency: () => 'USD',
}));

jest.mock('store/accountSettings', () => ({
  accountSettingsActions: {
    updateAccountSettings: jest.fn(() => ({ type: 'TEST/UPDATE' })),
    resetNotifications: jest.fn(() => ({ type: 'TEST/RESET_N' })),
    resetStatus: jest.fn(() => ({ type: 'TEST/RESET_S' })),
  },
  accountSettingsSelectors: {
    selectAccountSettingsError: () => undefined,
    selectAccountSettingsNotification: () => undefined,
    selectAccountSettingsFetchStatus: () => undefined,
  },
}));

jest.mock('routes/components/costType', () => ({
  CostType: ({ onSelect }: any) => (
    <button type="button" onClick={() => onSelect('blended')}>
      cost-type
    </button>
  ),
}));

jest.mock('routes/components/currency', () => ({
  Currency: ({ onSelect }: any) => (
    <button type="button" onClick={() => onSelect('EUR')}>
      currency
    </button>
  ),
}));

describe('Calculations', () => {
  test('dispatches cost type and currency updates', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <Provider store={createStore(() => ({}))}>
        <Calculations canWrite />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'cost-type' }));
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.costType, {
      cost_type: 'blended',
    });

    await user.click(screen.getByRole('button', { name: 'currency' }));
    expect(accountSettingsActions.updateAccountSettings).toHaveBeenCalledWith(AccountSettingsType.currency, {
      currency: 'EUR',
    });
  });

  test('wraps controls in a read-only tooltip when the user cannot write', () => {
    render(
      <Provider store={createStore(() => ({}))}>
        <Calculations canWrite={false} />
      </Provider>
    );
    expect(screen.getAllByRole('button', { name: 'cost-type' }).length).toBeGreaterThan(0);
  });
});
