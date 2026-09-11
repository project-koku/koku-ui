jest.mock('api/accountSettings');
jest.mock('utils/sessionStorage', () => ({
  getAccountCurrency: () => 'USD',
  isCurrencyAvailable: () => false,
  setAccountCurrency: jest.fn(),
  setCurrency: jest.fn(),
}));

import { waitFor } from '@testing-library/react';
import type { AccountSettings } from 'api/accountSettings';
import {
  AccountSettingsType,
  fetchAccountSettings,
  updateAccountSettings as apiUpdateAccountSettings,
} from 'api/accountSettings';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './accountSettingsActions';
import { stateKey as accountSettingsStateKey } from './accountSettingsCommon';
import { accountSettingsReducer } from './accountSettingsReducer';
import * as selectors from './accountSettingsSelectors';

const createProdvidersStore = createMockStoreCreator({
  [accountSettingsStateKey]: accountSettingsReducer,
});

const fetchAccountSettingsMock = fetchAccountSettings as jest.Mock;
const updateAccountSettingsMock = apiUpdateAccountSettings as jest.Mock;

// To do: Update for new account-settings API -- mimic cost-type API for now
const accountSettingsMock: AccountSettings = {
  data: [
    {
      code: 'unblended_cost',
      description: 'Unblended',
      name: 'Usage cost on the day you are charged',
    },
  ],
} as any;

fetchAccountSettingsMock.mockReturnValue(Promise.resolve({ data: accountSettingsMock }));

beforeEach(() => {
  jest.clearAllMocks();
  fetchAccountSettingsMock.mockReturnValue(Promise.resolve({ data: accountSettingsMock }));
  updateAccountSettingsMock.mockReset();
});

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.selectAccountSettingsState(store.getState())).toMatchSnapshot();
});

test('fetch account settings success', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchAccountSettings(AccountSettingsType.settings));
  expect(fetchAccountSettingsMock).toHaveBeenCalled();
  expect(selectors.selectAccountSettingsStatus(store.getState(), AccountSettingsType.settings)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectAccountSettingsStatus(store.getState(), AccountSettingsType.settings)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectAccountSettingsStatus(finishedState, AccountSettingsType.settings)).toBe(FetchStatus.complete);
});

test('fetch account settings failure', async () => {
  const store = createProdvidersStore();
  const error = Symbol('getAccountSettings error');
  fetchAccountSettingsMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.fetchAccountSettings(AccountSettingsType.settings));
  expect(fetchAccountSettingsMock).toHaveBeenCalled();
  expect(selectors.selectAccountSettingsStatus(store.getState(), AccountSettingsType.settings)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectAccountSettingsStatus(store.getState(), AccountSettingsType.settings)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectAccountSettingsStatus(finishedState, AccountSettingsType.settings)).toBe(FetchStatus.complete);
});

test('skips fetch when a request is already in progress', () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchAccountSettings(AccountSettingsType.settings));
  store.dispatch(actions.fetchAccountSettings(AccountSettingsType.settings));
  expect(fetchAccountSettingsMock).toHaveBeenCalledTimes(1);
});

test('update account settings success and failure', async () => {
  const store = createProdvidersStore();
  updateAccountSettingsMock.mockResolvedValueOnce({ data: { currency: 'EUR' } });
  store.dispatch(actions.updateAccountSettings(AccountSettingsType.currency, { currency: 'EUR' }));
  await waitFor(() =>
    expect(selectors.selectAccountSettingsUpdateStatus(store.getState(), AccountSettingsType.currency)).toBe(
      FetchStatus.complete
    )
  );
  expect(selectors.selectAccountSettingsUpdateNotification(store.getState(), AccountSettingsType.currency)).toBeTruthy();

  const errorStore = createProdvidersStore();
  updateAccountSettingsMock.mockRejectedValueOnce(new Error('fail'));
  errorStore.dispatch(actions.updateAccountSettings(AccountSettingsType.currency, { currency: 'EUR' }));
  await waitFor(() =>
    expect(selectors.selectAccountSettingsUpdateStatus(errorStore.getState(), AccountSettingsType.currency)).toBe(
      FetchStatus.complete
    )
  );
  expect(selectors.selectAccountSettingsUpdateError(errorStore.getState(), AccountSettingsType.currency)).toBeTruthy();
});

test('stores currency from a successful fetch', async () => {
  fetchAccountSettingsMock.mockResolvedValueOnce({
    data: { data: { currency: 'USD' } },
  });
  const store = createProdvidersStore();
  store.dispatch(actions.fetchAccountSettings(AccountSettingsType.settings));
  await waitFor(() =>
    expect(selectors.selectAccountSettingsStatus(store.getState(), AccountSettingsType.settings)).toBe(
      FetchStatus.complete
    )
  );
  expect(selectors.selectAccountSettings(store.getState(), AccountSettingsType.settings)).toEqual({
    data: { currency: 'USD' },
  });
});
