jest.mock('store/ocpOnCloudReports/ocpOnCloudReportsActions');

import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { ocpOnCloudReportsActions } from 'store/ocpOnCloudReports';
import * as actions from './ocpOnCloudDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  ocpOnCloudDashboardStateKey,
  OcpOnCloudDashboardTab,
} from './ocpOnCloudDashboardCommon';
import { ocpOnCloudDashboardReducer } from './ocpOnCloudDashboardReducer';
import * as selectors from './ocpOnCloudDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  cpuWidget,
  databaseWidget,
  memoryWidget,
  networkWidget,
  storageWidget,
  volumeWidget,
} from './ocpOnCloudDashboardWidgets';

const createOcpOnCloudDashboardStore = createMockStoreCreator({
  [ocpOnCloudDashboardStateKey]: ocpOnCloudDashboardReducer,
});

const fetchReportMock = ocpOnCloudReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpOnCloudDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createOcpOnCloudDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpOnCloudDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(
      costSummaryWidget.id,
      OcpOnCloudDashboardTab.projects
    )
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpOnCloudDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(OcpOnCloudDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(OcpOnCloudDashboardTab.nodes)).toMatchSnapshot();
  });

  test('pod tab', () => {
    expect(getGroupByForTab(OcpOnCloudDashboardTab.pods)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(OcpOnCloudDashboardTab.projects)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: OcpOnCloudReportType.cost,
    availableTabs: [OcpOnCloudDashboardTab.projects],
    currentTab: OcpOnCloudDashboardTab.projects,
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
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&group_by[project]=*',
    ],
    [{}, 'group_by[project]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[project]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
