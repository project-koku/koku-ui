jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { rhelHistoricalDataStateKey } from './rhelHistoricalDataCommon';
import { rhelHistoricalDataReducer } from './rhelHistoricalDataReducer';
import * as selectors from './rhelHistoricalDataSelectors';
import { costWidget, cpuUsageWidget, memoryUsageWidget } from './rhelHistoricalDataWidgets';

const createRhelHistoricalDataStore = createMockStoreCreator({
  [rhelHistoricalDataStateKey]: rhelHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createRhelHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, cpuUsageWidget.id, memoryUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
