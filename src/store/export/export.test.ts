jest.mock('api/export/exportUtils');

import { waitFor } from '@testing-library/react';
import type { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './exportActions';
import { exportStateKey } from './exportCommon';
import { exportReducer } from './exportReducer';
import * as selectors from './exportSelectors';

const createExportsStore = createMockStoreCreator({
  [exportStateKey]: exportReducer,
});

const runExportMock = runExport as jest.Mock;

const mockExport: Export = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const query = 'query';
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

runExportMock.mockResolvedValue({ data: mockExport });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'exportReport');
jest.spyOn(selectors, 'selectExportFetchStatus');

test('default state', () => {
  const store = createExportsStore();
  expect(selectors.selectExportState(store.getState())).toMatchSnapshot();
});

test('fetch export success', async () => {
  const store = createExportsStore();
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  expect(runExportMock).toBeCalled();
  expect(selectors.selectExportFetchStatus(store.getState(), reportPathsType, reportType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectExportFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectExportFetchStatus(finishedState, reportPathsType, reportType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectExportError(finishedState, reportPathsType, reportType, query)).toBe(null);
});

test('fetch export failure', async () => {
  const store = createExportsStore();
  const error = Symbol('export error');
  runExportMock.mockRejectedValueOnce(error);
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  expect(runExport).toBeCalled();
  expect(selectors.selectExportFetchStatus(store.getState(), reportPathsType, reportType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectExportFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectExportFetchStatus(finishedState, reportPathsType, reportType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectExportError(finishedState, reportPathsType, reportType, query)).toBe(error);
});

test('does not export if the request is in progress', () => {
  const store = createExportsStore();
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  expect(runExport).toHaveBeenCalledTimes(1);
});

test('export is not re-exported if it has not expired', async () => {
  const store = createExportsStore();
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  await waitFor(() => expect(actions.exportReport).toHaveBeenCalled());
  store.dispatch(actions.exportReport(reportPathsType, reportType, query));
  expect(runExport).toHaveBeenCalledTimes(1);
});
