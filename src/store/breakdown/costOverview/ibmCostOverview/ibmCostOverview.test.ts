jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { ibmCostOverviewStateKey } from './ibmCostOverviewCommon';
import { ibmCostOverviewReducer } from './ibmCostOverviewReducer';
import * as selectors from './ibmCostOverviewSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  projectSummaryWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './ibmCostOverviewWidgets';

const createIbmCostOverviewStore = createMockStoreCreator({
  [ibmCostOverviewStateKey]: ibmCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createIbmCostOverviewStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costBreakdownWidget.id,
    accountSummaryWidget.id,
    projectSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costBreakdownWidget.id)).toEqual(costBreakdownWidget);
});
