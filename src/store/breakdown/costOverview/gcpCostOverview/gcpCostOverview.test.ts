jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { gcpCostOverviewStateKey } from './gcpCostOverviewCommon';
import { gcpCostOverviewReducer } from './gcpCostOverviewReducer';
import * as selectors from './gcpCostOverviewSelectors';
import {
  accountSummaryWidget,
  costWidget,
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
    costWidget.id,
    accountSummaryWidget.id,
    projectSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
