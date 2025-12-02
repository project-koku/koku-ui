jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from '../../../mockStore';
import { reportActions } from '../../../reports';

import { awsCostOverviewStateKey } from './awsCostOverviewCommon';
import { awsCostOverviewReducer } from './awsCostOverviewReducer';
import * as selectors from './awsCostOverviewSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
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
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costBreakdownWidget.id)).toEqual(costBreakdownWidget);
});
