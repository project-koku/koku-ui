jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { gcpCostOverviewStateKey } from './gcpCostOverviewCommon';
import { gcpCostOverviewReducer } from './gcpCostOverviewReducer';
import * as selectors from './gcpCostOverviewSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  projectSummaryWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './gcpCostOverviewWidgets';

const createGcpCostOverviewStore = createMockStoreCreator({
  [gcpCostOverviewStateKey]: gcpCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createGcpCostOverviewStore();
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
