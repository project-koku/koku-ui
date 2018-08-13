jest.mock('../reports/reportsActions');

import { createMockStoreCreator } from '../mockStore';
import { reportsActions } from '../reports';
import * as actions from './dashboardActions';
import {
  dashboardStateKey,
  DashboardTab,
  getGroupByForTab,
} from './dashboardCommon';
import { dashboardReducer } from './dashboardReducer';
import * as selectors from './dashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  storageWidget,
} from './dashboardWidgets';

const createDashboardStore = createMockStoreCreator({
  [dashboardStateKey]: dashboardReducer,
});

const fetchReportMock = reportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, DashboardTab.regions)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(DashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(2);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(DashboardTab.services)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(DashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(DashboardTab.regions)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});
