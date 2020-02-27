jest.mock('store/ocpReports/ocpReportsActions');

import { OcpReportType } from 'api/ocpReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { ocpReportsActions } from 'store/ocpReports';
import * as actions from './ocpSupplementaryDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidgetTabs,
  ocpSupplementaryDashboardStateKey,
  OcpSupplementaryDashboardTab,
} from './ocpSupplementaryDashboardCommon';
import { ocpSupplementaryDashboardReducer } from './ocpSupplementaryDashboardReducer';
import * as selectors from './ocpSupplementaryDashboardSelectors';
import {
  costSummaryWidget,
  cpuWidget,
  memoryWidget,
  volumeWidget,
} from './ocpSupplementaryDashboardWidgets';

const createOcpSupplementaryDashboardStore = createMockStoreCreator({
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
});

const fetchReportMock = ocpReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpSupplementaryDashboardStore();
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
  const store = createOcpSupplementaryDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpSupplementaryDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(
      costSummaryWidget.id,
      OcpSupplementaryDashboardTab.projects
    )
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpSupplementaryDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(
      getGroupByForTab(OcpSupplementaryDashboardTab.clusters)
    ).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(
      getGroupByForTab(OcpSupplementaryDashboardTab.nodes)
    ).toMatchSnapshot();
  });

  test('pod tab', () => {
    expect(
      getGroupByForTab(OcpSupplementaryDashboardTab.pods)
    ).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(
      getGroupByForTab(OcpSupplementaryDashboardTab.projects)
    ).toMatchSnapshot();
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
    availableTabs: [OcpSupplementaryDashboardTab.projects],
    currentTab: OcpSupplementaryDashboardTab.projects,
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
