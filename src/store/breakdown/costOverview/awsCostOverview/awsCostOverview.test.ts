jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { awsCostOverviewStateKey } from './awsCostOverviewCommon';
import { awsCostOverviewReducer } from './awsCostOverviewReducer';
import * as selectors from './awsCostOverviewSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  costWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './awsCostOverviewWidgets';

const createAwsCostOverviewStore = createMockStoreCreator({
  [awsCostOverviewStateKey]: awsCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAwsCostOverviewStore();
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
