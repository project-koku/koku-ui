jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';
import { awsDetailsStateKey } from './awsDetailsCommon';
import { awsDetailsReducer } from './awsDetailsReducer';
import * as selectors from './awsDetailsSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './awsDetailsWidgets';

const createAwsDetailsStore = createMockStoreCreator({
  [awsDetailsStateKey]: awsDetailsReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAwsDetailsStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costBreakdownWidget.id,
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costBreakdownWidget.id)).toEqual(
    costBreakdownWidget
  );
});
