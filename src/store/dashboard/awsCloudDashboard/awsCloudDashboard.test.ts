jest.mock('store/reports/awsReports/awsReportsActions');

import { AwsReportType } from 'api/reports/awsReports';
import { ChartType } from 'components/charts/common/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { awsReportsActions } from 'store/reports/awsReports';
import * as actions from './awsCloudDashboardActions';
import {
  awsCloudDashboardStateKey,
  AwsCloudDashboardTab,
  getGroupByForTab,
  getQueryForWidgetTabs,
} from './awsCloudDashboardCommon';
import { awsCloudDashboardReducer } from './awsCloudDashboardReducer';
import * as selectors from './awsCloudDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './awsCloudDashboardWidgets';

const createAwsCloudDashboardStore = createMockStoreCreator({
  [awsCloudDashboardStateKey]: awsCloudDashboardReducer,
});

const fetchReportMock = awsReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAwsCloudDashboardStore();
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
  const store = createAwsCloudDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAwsCloudDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, AwsCloudDashboardTab.regions)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AwsCloudDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(AwsCloudDashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(
      getGroupByForTab(AwsCloudDashboardTab.instanceType)
    ).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(AwsCloudDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(AwsCloudDashboardTab.regions)).toMatchSnapshot();
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
    availableTabs: [AwsCloudDashboardTab.accounts],
    currentTab: AwsCloudDashboardTab.accounts,
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
