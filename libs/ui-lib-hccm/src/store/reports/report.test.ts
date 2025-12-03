jest.mock('@koku-ui/api/reports/reportUtils');

import { waitFor } from '@testing-library/react';
import type { Report } from '@koku-ui/api/reports/report';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { runReport } from '@koku-ui/api/reports/reportUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

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

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;
const reportQueryString = 'reportQueryString';

runReportMock.mockResolvedValue({ data: mockReport });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createReportsStore();
  expect(selectors.selectReportState(store.getState())).toMatchSnapshot();
});

test('fetch report success', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  expect(runReportMock).toHaveBeenCalled();
  expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, reportQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, reportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectReportFetchStatus(finishedState, reportPathsType, reportType, reportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectReportError(finishedState, reportPathsType, reportType, reportQueryString)).toBe(null);
});

test('fetch report failure', async () => {
  const store = createReportsStore();
  const error = Symbol('report error');
  runReportMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  expect(runReport).toHaveBeenCalled();
  expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, reportQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, reportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectReportFetchStatus(finishedState, reportPathsType, reportType, reportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectReportError(finishedState, reportPathsType, reportType, reportQueryString)).toBe(error);
});

test('does not fetch report if the request is in progress', () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  expect(runReport).toHaveBeenCalledTimes(1);
});

test('report is not refetched if it has not expired', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  await waitFor(() =>
    expect(selectors.selectReportFetchStatus(store.getState(), reportPathsType, reportType, reportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  store.dispatch(actions.fetchReport(reportPathsType, reportType, reportQueryString));
  expect(runReport).toHaveBeenCalledTimes(1);
});
