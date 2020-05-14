jest.mock('store/reports/reportActions');

import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';
import { ocpDetailsStateKey } from './ocpDetailsCommon';
import { ocpDetailsReducer } from './ocpDetailsReducer';
import * as selectors from './ocpDetailsSelectors';
import {
  costBreakdownWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
} from './ocpDetailsWidgets';

const createOcpDetailsStore = createMockStoreCreator({
  [ocpDetailsStateKey]: ocpDetailsReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpDetailsStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costBreakdownWidget.id,
    projectSummaryWidget.id,
    memoryUsageWidget.id,
    cpuUsageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costBreakdownWidget.id)).toEqual(
    costBreakdownWidget
  );
});
