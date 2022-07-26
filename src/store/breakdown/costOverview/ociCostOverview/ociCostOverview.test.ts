jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import { ociCostOverviewStateKey } from './ociCostOverviewCommon';
import { ociCostOverviewReducer } from './ociCostOverviewReducer';
import * as selectors from './ociCostOverviewSelectors';
import {
  accountSummaryWidget,
  costWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './ociCostOverviewWidgets';

const createOciCostOverviewStore = createMockStoreCreator({
  [ociCostOverviewStateKey]: ociCostOverviewReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOciCostOverviewStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costWidget.id,
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costWidget.id)).toEqual(costWidget);
});
