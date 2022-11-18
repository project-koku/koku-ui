jest.mock('api/orgs/orgUtils');

import { waitFor } from '@testing-library/react';
import type { Org } from 'api/orgs/org';
import { OrgPathsType, OrgType } from 'api/orgs/org';
import { runOrg } from 'api/orgs/orgUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

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

const orgReportType = OrgType.org;
const orgReportPathsType = OrgPathsType.aws;
const orgQueryString = 'orgQueryString';

runOrgMock.mockResolvedValue({ data: mockOrgReport });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchOrg');
jest.spyOn(selectors, 'selectOrgFetchStatus');

test('default state', () => {
  const store = createOrgsStore();
  expect(selectors.selectOrgState(store.getState())).toMatchSnapshot();
});

test('fetch org report success', async () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  expect(runOrgMock).toBeCalled();
  expect(selectors.selectOrgFetchStatus(store.getState(), orgReportPathsType, orgReportType, orgQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectOrgFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectOrgFetchStatus(finishedState, orgReportPathsType, orgReportType, orgQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectOrgError(finishedState, orgReportPathsType, orgReportType, orgQueryString)).toBe(null);
});

test('fetch org report failure', async () => {
  const store = createOrgsStore();
  const error = Symbol('org error');
  runOrgMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  expect(runOrg).toBeCalled();
  expect(selectors.selectOrgFetchStatus(store.getState(), orgReportPathsType, orgReportType, orgQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectOrgFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectOrgFetchStatus(finishedState, orgReportPathsType, orgReportType, orgQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectOrgError(finishedState, orgReportPathsType, orgReportType, orgQueryString)).toBe(error);
});

test('does not fetch org report if the request is in progress', () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  expect(runOrg).toHaveBeenCalledTimes(1);
});

test('org report is not refetched if it has not expired', async () => {
  const store = createOrgsStore();
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  await waitFor(() => expect(actions.fetchOrg).toHaveBeenCalled());
  store.dispatch(actions.fetchOrg(orgReportPathsType, orgReportType, orgQueryString));
  expect(runOrg).toHaveBeenCalledTimes(1);
});
