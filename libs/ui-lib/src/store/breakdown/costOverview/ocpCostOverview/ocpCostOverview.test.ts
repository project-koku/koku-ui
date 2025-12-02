jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { ocpCostOverviewStateKey } from './ocpCostOverviewCommon';
import { ocpCostOverviewReducer } from './ocpCostOverviewReducer';
import * as selectors from './ocpCostOverviewSelectors';
import {
  clusterWidget,
  costBreakdownWidget,
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
    projectSummaryWidget.id,
    volumeSummaryWidget.id,
    clusterWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    pvcWidget.id,
    volumeUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costBreakdownWidget.id)).toEqual(costBreakdownWidget);
});
