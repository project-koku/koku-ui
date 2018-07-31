jest.mock('api/reports');

import { Report, ReportType, runReport } from 'api/reports';
import { wait } from 'testUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';
import * as actions from './reportsActions';
import { reportsStateKey } from './reportsCommon';
import { reportsReducer } from './reportsReducer';
import * as selectors from './reportsSelectors';

const createReportsStore = createMockStoreCreator({
  [reportsStateKey]: reportsReducer,
});

const runReportMock = runReport as jest.Mock;

const mockReport: Report = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
};

const query = 'query';
const reportType = ReportType.cost;

runReportMock.mockResolvedValue({ data: mockReport });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createReportsStore();
  expect(selectors.selectReportsState(store.getState())).toMatchSnapshot();
});

test('fetch report success', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportType, query));
  expect(runReportMock).toBeCalled();
  expect(
    selectors.selectReportFetchStatus(store.getState(), reportType, query)
  ).toBe(FetchStatus.inProgress);
  await wait();
  const finishedState = store.getState();
  expect(
    selectors.selectReport(finishedState, reportType, query)
  ).toMatchSnapshot();
  expect(
    selectors.selectReportFetchStatus(finishedState, reportType, query)
  ).toBe(FetchStatus.complete);
  expect(selectors.selectReportError(finishedState, reportType, query)).toBe(
    null
  );
});

test('fetch report failure', async () => {
  const store = createReportsStore();
  const error = Symbol('report error');
  runReportMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchReport(reportType, query));
  expect(runReport).toBeCalled();
  expect(
    selectors.selectReportFetchStatus(store.getState(), reportType, query)
  ).toBe(FetchStatus.inProgress);
  await wait();
  const finishedState = store.getState();
  expect(
    selectors.selectReportFetchStatus(finishedState, reportType, query)
  ).toBe(FetchStatus.complete);
  expect(selectors.selectReportError(finishedState, reportType, query)).toBe(
    error
  );
});

test('does not fetch report if the request is in progress', () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportType, query));
  store.dispatch(actions.fetchReport(reportType, query));
  expect(runReport).toHaveBeenCalledTimes(1);
});

test('report is not refetched if it has not expired', async () => {
  const store = createReportsStore();
  store.dispatch(actions.fetchReport(reportType, query));
  await wait();
  store.dispatch(actions.fetchReport(reportType, query));
  expect(runReport).toHaveBeenCalledTimes(1);
});
