jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { awsHistoricalDataStateKey } from './awsHistoricalDataCommon';
import { awsHistoricalDataReducer } from './awsHistoricalDataReducer';
import * as selectors from './awsHistoricalDataSelectors';
import { computeUsageWidget, costWidget, storageUsageWidget } from './awsHistoricalDataWidgets';

const createAwsHistoricalDataStore = createMockStoreCreator({
  [awsHistoricalDataStateKey]: awsHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAwsHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([costWidget.id, computeUsageWidget.id, storageUsageWidget.id]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
