jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { gcpHistoricalDataStateKey } from './gcpHistoricalDataCommon';
import { gcpHistoricalDataReducer } from './gcpHistoricalDataReducer';
import * as selectors from './gcpHistoricalDataSelectors';
import { computeUsageWidget, costWidget, storageUsageWidget } from './gcpHistoricalDataWidgets';

const createGcpHistoricalDataStore = createMockStoreCreator({
  [gcpHistoricalDataStateKey]: gcpHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createGcpHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, computeUsageWidget.id, storageUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
