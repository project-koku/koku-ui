jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { azureCostOverviewStateKey } from './azureCostOverviewCommon';
import { azureCostOverviewReducer } from './azureCostOverviewReducer';
import * as selectors from './azureCostOverviewSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  costWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './azureCostOverviewWidgets';

const createAzureCostOverviewStore = createMockStoreCreator({
  [azureCostOverviewStateKey]: azureCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureCostOverviewStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costBreakdownWidget.id,
    costWidget.id,
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
