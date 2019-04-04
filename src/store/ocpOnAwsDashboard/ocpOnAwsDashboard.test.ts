jest.mock('store/ocpOnAwsReports/ocpOnAwsReportsActions');

import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { ocpOnAwsReportsActions } from 'store/ocpOnAwsReports';
import * as actions from './ocpOnAwsDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  ocpOnAwsDashboardStateKey,
  OcpOnAwsDashboardTab,
} from './ocpOnAwsDashboardCommon';
import { ocpOnAwsDashboardReducer } from './ocpOnAwsDashboardReducer';
import * as selectors from './ocpOnAwsDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  cpuWidget,
  memoryWidget,
  storageWidget,
} from './ocpOnAwsDashboardWidgets';

const createOcpOnAwsDashboardStore = createMockStoreCreator({
  [ocpOnAwsDashboardStateKey]: ocpOnAwsDashboardReducer,
});

const fetchReportMock = ocpOnAwsReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpOnAwsDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    cpuWidget.id,
    memoryWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createOcpOnAwsDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpOnAwsDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, OcpOnAwsDashboardTab.projects)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpOnAwsDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(OcpOnAwsDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(OcpOnAwsDashboardTab.nodes)).toMatchSnapshot();
  });

  test('pod tab', () => {
    expect(getGroupByForTab(OcpOnAwsDashboardTab.pods)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(OcpOnAwsDashboardTab.projects)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: OcpOnAwsReportType.cost,
    availableTabs: [OcpOnAwsDashboardTab.projects],
    currentTab: OcpOnAwsDashboardTab.projects,
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
