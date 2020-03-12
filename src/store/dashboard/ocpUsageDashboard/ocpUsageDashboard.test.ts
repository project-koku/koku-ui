jest.mock('store/reports/ocpReports/ocpReportsActions');

import { OcpReportType } from 'api/reports/ocpReports';
import { ChartType } from 'components/charts/common/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { ocpReportsActions } from 'store/reports/ocpReports';
import * as actions from './ocpUsageDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  ocpUsageDashboardStateKey,
  OcpUsageDashboardTab,
} from './ocpUsageDashboardCommon';
import { ocpUsageDashboardReducer } from './ocpUsageDashboardReducer';
import * as selectors from './ocpUsageDashboardSelectors';
import {
  costSummaryWidget,
  cpuWidget,
  memoryWidget,
  volumeWidget,
} from './ocpUsageDashboardWidgets';

const createOcpUsageDashboardStore = createMockStoreCreator({
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
});

const fetchReportMock = ocpReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpUsageDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createOcpUsageDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpUsageDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, OcpUsageDashboardTab.projects)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpUsageDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(OcpUsageDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(OcpUsageDashboardTab.nodes)).toMatchSnapshot();
  });

  test('pod tab', () => {
    expect(getGroupByForTab(OcpUsageDashboardTab.pods)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(OcpUsageDashboardTab.projects)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: OcpReportType.cost,
    availableTabs: [OcpUsageDashboardTab.projects],
    currentTab: OcpUsageDashboardTab.projects,
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
