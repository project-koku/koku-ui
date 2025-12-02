jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { azureHistoricalDataStateKey } from './azureHistoricalDataCommon';
import { azureHistoricalDataReducer } from './azureHistoricalDataReducer';
import * as selectors from './azureHistoricalDataSelectors';
import { computeUsageWidget, costWidget, storageUsageWidget } from './azureHistoricalDataWidgets';

const createAzureHistoricalDataStore = createMockStoreCreator({
  [azureHistoricalDataStateKey]: azureHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, computeUsageWidget.id, storageUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
