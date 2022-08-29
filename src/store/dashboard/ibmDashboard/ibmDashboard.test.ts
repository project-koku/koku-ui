jest.mock('store/reports/reportActions');

import { ReportType } from 'api/reports/report';
import { ChartType } from 'routes/views/components/charts/common/chartDatumUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import * as actions from './ibmDashboardActions';
import { getGroupByForTab, getQueryForWidgetTabs, ibmDashboardStateKey, IbmDashboardTab } from './ibmDashboardCommon';
import { ibmDashboardReducer } from './ibmDashboardReducer';
import * as selectors from './ibmDashboardSelectors';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './ibmDashboardWidgets';

const createIbmDashboardStore = createMockStoreCreator({
  [ibmDashboardStateKey]: ibmDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createIbmDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createIbmDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createIbmDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, IbmDashboardTab.regions));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(IbmDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(IbmDashboardTab.services)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(IbmDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(IbmDashboardTab.regions)).toMatchSnapshot();
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
    availableTabs: [IbmDashboardTab.accounts],
    currentTab: IbmDashboardTab.accounts,
    details: { formatOptions: {} },
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
