jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { ibmHistoricalDataStateKey } from './ibmHistoricalDataCommon';
import { ibmHistoricalDataReducer } from './ibmHistoricalDataReducer';
import * as selectors from './ibmHistoricalDataSelectors';
import { computeUsageWidget, costWidget, storageUsageWidget } from './ibmHistoricalDataWidgets';

const createIbmHistoricalDataStore = createMockStoreCreator({
  [ibmHistoricalDataStateKey]: ibmHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createIbmHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, computeUsageWidget.id, storageUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
