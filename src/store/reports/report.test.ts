jest.mock('api/reports/reportUtils');

import { waitFor } from '@testing-library/react';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { runReport } from 'api/reports/reportUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './reportActions';
import { reportStateKey } from './reportCommon';
import { reportReducer } from './reportReducer';
import * as selectors from './reportSelectors';

const createReportsStore = createMockStoreCreator({
  [reportStateKey]: reportReducer,
});

const runReportMock = runReport as jest.Mock;

const mockReport: Report = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const query = 'query';
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

runReportMock.mockResolvedValue({ data: mockReport });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchReport');
jest.spyOn(selectors, 'selectReportFetchStatus');

test('default state', () => {
  const store = createReportsStore();
  expect(selectors.selectReportState(store.getState())).toMatchSnapshot();
});

test('fetch report success', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  expect(runReportMock).toBeCalled();
  expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectReportFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectReportFetchStatus(finishedState, reportPathsType, reportType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectReportError(finishedState, reportPathsType, reportType, query)).toBe(null);
});

test('fetch report failure', async () => {
  const store = createReportsStore();
  const error = Symbol('report error');
  runReportMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  expect(runReport).toBeCalled();
  expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectReportFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectReportFetchStatus(finishedState, reportPathsType, reportType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectReportError(finishedState, reportPathsType, reportType, query)).toBe(error);
});

test('does not fetch report if the request is in progress', () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  expect(runReport).toHaveBeenCalledTimes(1);
});

test('report is not refetched if it has not expired', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  await waitFor(() => expect(actions.fetchReport).toHaveBeenCalled());
  store.dispatch(actions.fetchReport(reportPathsType, reportType, query));
  expect(runReport).toHaveBeenCalledTimes(1);
});
