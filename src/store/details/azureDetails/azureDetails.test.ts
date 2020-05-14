jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';
import { azureDetailsStateKey } from './azureDetailsCommon';
import { azureDetailsReducer } from './azureDetailsReducer';
import * as selectors from './azureDetailsSelectors';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './azureDetailsWidgets';

const createAzureDetailsStore = createMockStoreCreator({
  [azureDetailsStateKey]: azureDetailsReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureDetailsStore();
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
