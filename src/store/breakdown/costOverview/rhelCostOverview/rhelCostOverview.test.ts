jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { rhelCostOverviewStateKey } from './rhelCostOverviewCommon';
import { rhelCostOverviewReducer } from './rhelCostOverviewReducer';
import * as selectors from './rhelCostOverviewSelectors';
import {
  clusterWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
  volumeUsageWidget,
} from './rhelCostOverviewWidgets';

const createRhelCostOverviewStore = createMockStoreCreator({
  [rhelCostOverviewStateKey]: rhelCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createRhelCostOverviewStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costWidget.id,
    clusterWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    volumeUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
