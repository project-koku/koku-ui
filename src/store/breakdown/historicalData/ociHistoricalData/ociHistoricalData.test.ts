jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { ociHistoricalDataStateKey } from './ociHistoricalDataCommon';
import { ociHistoricalDataReducer } from './ociHistoricalDataReducer';
import * as selectors from './ociHistoricalDataSelectors';
import { computeUsageWidget, costWidget, storageUsageWidget } from './ociHistoricalDataWidgets';

const createOciHistoricalDataStore = createMockStoreCreator({
  [ociHistoricalDataStateKey]: ociHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOciHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, computeUsageWidget.id, storageUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
