jest.mock('store/reports/reportActions');

import { ReportType } from 'api/reports/report';
import { ComputedReportItemType, DatumType } from 'routes/views/components/charts/common/chartDatum';
import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import * as actions from './ocpDashboardActions';
import { getGroupByForTab, getQueryForWidgetTabs, ocpDashboardStateKey, OcpDashboardTab } from './ocpDashboardCommon';
import { ocpDashboardReducer } from './ocpDashboardReducer';
import * as selectors from './ocpDashboardSelectors';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './ocpDashboardWidgets';

const createOcpDashboardStore = createMockStoreCreator({
  [ocpDashboardStateKey]: ocpDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createOcpDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, OcpDashboardTab.projects));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpDashboardTab.projects);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('clusters tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.clusters)).toMatchSnapshot();
  });

  test('nodes tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.nodes)).toMatchSnapshot();
  });

  test('projects tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.projects)).toMatchSnapshot();
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
    availableTabs: [OcpDashboardTab.projects],
    currentTab: OcpDashboardTab.projects,
    details: { formatOptions: {} },
    trend: {
      computedReportItem: ComputedReportItemType.cost,
      datumType: DatumType.rolling,
      formatOptions: {},
      titleKey: '',
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
