jest.mock('api/export/exportUtils');

import { waitFor } from '@testing-library/react';
import type { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { SettingsType } from 'api/settings';
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

const exportType = ReportType.cost;
const exportPathsType = ReportPathsType.aws;
const exportQueryString = 'exportQueryString';

runExportMock.mockResolvedValue({ data: mockExport });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createExportsStore();
  expect(selectors.selectExportState(store.getState())).toMatchSnapshot();
});

test('fetch export success', async () => {
  const store = createExportsStore();
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  expect(runExportMock).toHaveBeenCalled();
  expect(selectors.selectExportFetchStatus(store.getState(), exportPathsType, exportType, exportQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectExportFetchStatus(store.getState(), exportPathsType, exportType, exportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectExportFetchStatus(finishedState, exportPathsType, exportType, exportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectExportError(finishedState, exportPathsType, exportType, exportQueryString)).toBe(null);
});

test('fetch export failure', async () => {
  const store = createExportsStore();
  const error = Symbol('export error');
  runExportMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  expect(runExport).toHaveBeenCalled();
  expect(selectors.selectExportFetchStatus(store.getState(), exportPathsType, exportType, exportQueryString)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() =>
    expect(selectors.selectExportFetchStatus(store.getState(), exportPathsType, exportType, exportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  const finishedState = store.getState();
  expect(selectors.selectExportFetchStatus(finishedState, exportPathsType, exportType, exportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectExportError(finishedState, exportPathsType, exportType, exportQueryString)).toBe(error);
});

test('does not export if the request is in progress', () => {
  const store = createExportsStore();
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  expect(runExport).toHaveBeenCalledTimes(1);
});

test('export is not re-exported if it has not expired', async () => {
  const store = createExportsStore();
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  await waitFor(() =>
    expect(selectors.selectExportFetchStatus(store.getState(), exportPathsType, exportType, exportQueryString)).toBe(
      FetchStatus.complete
    )
  );
  store.dispatch(actions.fetchExport(exportPathsType, exportType, exportQueryString));
  expect(runExport).toHaveBeenCalledTimes(1);
});

test('currency export is re-exported even if it has not expired', async () => {
  const store = createExportsStore();
  const currencyPathsType = SettingsType.currency;
  const currencyExportType = SettingsType.currency;
  runExportMock.mockClear();

  store.dispatch(actions.fetchExport(currencyPathsType, currencyExportType, exportQueryString));
  await waitFor(() =>
    expect(
      selectors.selectExportFetchStatus(store.getState(), currencyPathsType, currencyExportType, exportQueryString)
    ).toBe(FetchStatus.complete)
  );
  store.dispatch(actions.fetchExport(currencyPathsType, currencyExportType, exportQueryString));
  expect(runExportMock).toHaveBeenCalledTimes(2);
});

test('currency export does not re-export while a request is in progress', () => {
  const store = createExportsStore();
  const currencyPathsType = SettingsType.currency;
  const currencyExportType = SettingsType.currency;
  runExportMock.mockClear();

  store.dispatch(actions.fetchExport(currencyPathsType, currencyExportType, exportQueryString));
  store.dispatch(actions.fetchExport(currencyPathsType, currencyExportType, exportQueryString));
  expect(runExportMock).toHaveBeenCalledTimes(1);
});
