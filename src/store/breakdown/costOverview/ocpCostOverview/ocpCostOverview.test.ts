jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { ocpCostOverviewStateKey } from './ocpCostOverviewCommon';
import { ocpCostOverviewReducer } from './ocpCostOverviewReducer';
import * as selectors from './ocpCostOverviewSelectors';
import {
  clusterWidget,
  costBreakdownWidget,
  costDistributionWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
  pvcWidget,
  volumeSummaryWidget,
  volumeUsageWidget,
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
    costBreakdownWidget.id,
    costWidget.id,
    costDistributionWidget.id,
    projectSummaryWidget.id,
    volumeSummaryWidget.id,
    clusterWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    pvcWidget.id,
    volumeUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
