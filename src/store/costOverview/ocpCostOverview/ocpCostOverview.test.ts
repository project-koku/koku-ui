jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';
import { ocpCostOverviewStateKey } from './ocpCostOverviewCommon';
import { ocpCostOverviewReducer } from './ocpCostOverviewReducer';
import * as selectors from './ocpCostOverviewSelectors';
import {
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
} from './ocpCostOverviewWidgets';

const createOcpCostOverviewStore = createMockStoreCreator({
  [ocpCostOverviewStateKey]: ocpCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpCostOverviewStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
