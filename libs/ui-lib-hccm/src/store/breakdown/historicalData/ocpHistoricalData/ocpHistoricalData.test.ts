jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { ocpHistoricalDataStateKey } from './ocpHistoricalDataCommon';
import { ocpHistoricalDataReducer } from './ocpHistoricalDataReducer';
import * as selectors from './ocpHistoricalDataSelectors';
import {
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  networkUsageWidget,
  volumeUsageWidget,
} from './ocpHistoricalDataWidgets';

const createOcpHistoricalDataStore = createMockStoreCreator({
  [ocpHistoricalDataStateKey]: ocpHistoricalDataReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpHistoricalDataStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    networkUsageWidget.id,
    volumeUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
