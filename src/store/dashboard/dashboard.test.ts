jest.mock('store/awsReports/awsReportsActions');

import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { awsReportsActions } from 'store/awsReports';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './dashboardActions';
import {
  dashboardStateKey,
  DashboardTab,
  getGroupByForTab,
  getQueryForWidgetTabs,
} from './dashboardCommon';
import { dashboardReducer } from './dashboardReducer';
import * as selectors from './dashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './dashboardWidgets';

const createDashboardStore = createMockStoreCreator({
  [dashboardStateKey]: dashboardReducer,
});

const fetchReportMock = awsReportsActions.fetchReport as jest.Mock;

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
    networkWidget.id,
    databaseWidget.id,
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
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(DashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(getGroupByForTab(DashboardTab.instanceType)).toMatchSnapshot();
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

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: AwsReportType.cost,
    availableTabs: [DashboardTab.accounts],
    currentTab: DashboardTab.accounts,
    details: { labelKey: '', formatOptions: {} },
    trend: {
      titleKey: '',
      type: ChartType.daily,
      formatOptions: {},
    },
    topItems: {
      formatOptions: {},
    },
  };

  [
    [
      undefined,
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&group_by[account]=*',
    ],
    [{}, 'group_by[account]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[account]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
