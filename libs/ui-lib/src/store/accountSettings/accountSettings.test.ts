jest.mock('@koku-ui/api/accountSettings');

import { waitFor } from '@testing-library/react';
import type { AccountSettings } from '@koku-ui/api/accountSettings';
import { AccountSettingsType, fetchAccountSettings } from '@koku-ui/api/accountSettings';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './accountSettingsActions';
import { accountSettingsStateKey } from './accountSettingsCommon';
import { accountSettingsReducer } from './accountSettingsReducer';
import * as selectors from './accountSettingsSelectors';

const createProdvidersStore = createMockStoreCreator({
  [accountSettingsStateKey]: accountSettingsReducer,
});

const fetchAccountSettingsMock = fetchAccountSettings as jest.Mock;

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
