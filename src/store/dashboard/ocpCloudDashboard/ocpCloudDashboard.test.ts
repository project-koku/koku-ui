jest.mock('store/reports/ocpCloudReports/ocpCloudReportsActions');

import { ReportType } from 'api/reports/report';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { ocpCloudReportsActions } from 'store/reports/ocpCloudReports';
import * as actions from './ocpCloudDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  ocpCloudDashboardStateKey,
  OcpCloudDashboardTab,
} from './ocpCloudDashboardCommon';
import { ocpCloudDashboardReducer } from './ocpCloudDashboardReducer';
import * as selectors from './ocpCloudDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './ocpCloudDashboardWidgets';

const createOcpCloudDashboardStore = createMockStoreCreator({
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
});

const fetchReportMock = ocpCloudReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpCloudDashboardStore();
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
  const store = createOcpCloudDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpCloudDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, OcpCloudDashboardTab.projects)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpCloudDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.nodes)).toMatchSnapshot();
  });

  test('pod tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.pods)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.projects)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: ReportType.cost,
    availableTabs: [OcpCloudDashboardTab.projects],
    currentTab: OcpCloudDashboardTab.projects,
    details: { labelKey: '', formatOptions: {} },
    trend: {
      comparison: ChartComparison.cost,
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
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&group_by[project]=*',
    ],
    [{}, 'group_by[project]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[project]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
