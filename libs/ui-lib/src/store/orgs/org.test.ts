jest.mock('@koku-ui/api/orgs/orgUtils');

import { waitFor } from '@testing-library/react';
import type { Org } from '@koku-ui/api/orgs/org';
import { OrgPathsType, OrgType } from '@koku-ui/api/orgs/org';
import { runOrg } from '@koku-ui/api/orgs/orgUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './orgActions';
import { orgStateKey } from './orgCommon';
import { orgReducer } from './orgReducer';
import * as selectors from './orgSelectors';

const createOrgsStore = createMockStoreCreator({
  [orgStateKey]: orgReducer,
});

const runOrgMock = runOrg as jest.Mock;

const mockOrgReport: Org = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const orgType = OrgType.org;
const orgPathsType = OrgPathsType.aws;
const orgQueryString = 'orgQueryString';

runOrgMock.mockResolvedValue({ data: mockOrgReport });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createOrgsStore();
  expect(selectors.selectOrgState(store.getState())).toMatchSnapshot();
});

test('fetch org report success', async () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  expect(runOrgMock).toHaveBeenCalled();
  expect(selectors.selectOrgFetchStatus(store.getState(), orgPathsType, orgType, orgQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectOrgFetchStatus(store.getState(), orgPathsType, orgType, orgQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectOrgFetchStatus(finishedState, orgPathsType, orgType, orgQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectOrgError(finishedState, orgPathsType, orgType, orgQueryString)).toBe(null);
});

test('fetch org report failure', async () => {
  const store = createOrgsStore();
  const error = Symbol('org error');
  runOrgMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  expect(runOrg).toHaveBeenCalled();
  expect(selectors.selectOrgFetchStatus(store.getState(), orgPathsType, orgType, orgQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectOrgFetchStatus(store.getState(), orgPathsType, orgType, orgQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectOrgFetchStatus(finishedState, orgPathsType, orgType, orgQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectOrgError(finishedState, orgPathsType, orgType, orgQueryString)).toBe(error);
});

test('does not fetch org report if the request is in progress', () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  expect(runOrg).toHaveBeenCalledTimes(1);
});

test('org report is not refetched if it has not expired', async () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  await waitFor(() =>
    expect(selectors.selectOrgFetchStatus(store.getState(), orgPathsType, orgType, orgQueryString)).toBe(
      FetchStatus.complete
    )
  );
  store.dispatch(actions.fetchOrg(orgPathsType, orgType, orgQueryString));
  expect(runOrg).toHaveBeenCalledTimes(1);
});
