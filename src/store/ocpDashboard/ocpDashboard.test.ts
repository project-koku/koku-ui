jest.mock('../reports/reportsActions');

import { ReportType } from '../../api/reports';
import { ChartType } from '../../components/commonChart/chartUtils';
import { createMockStoreCreator } from '../mockStore';
import { reportsActions } from '../reports';
import * as actions from './ocpDashboardActions';
import {
  getGroupByForTab,
  getQueryForWidget,
  ocpDashboardStateKey,
  OcpDashboardTab,
} from './ocpDashboardCommon';
import { ocpDashboardReducer } from './ocpDashboardReducer';
import * as selectors from './ocpDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  storageWidget,
} from './ocpDashboardWidgets';

const createOcpDashboardStore = createMockStoreCreator({
  [ocpDashboardStateKey]: ocpDashboardReducer,
});

const fetchReportMock = reportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createOcpDashboardStore();
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
  const store = createOcpDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, OcpDashboardTab.regions)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.instanceType)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(OcpDashboardTab.regions)).toMatchSnapshot();
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
    availableTabs: [OcpDashboardTab.accounts],
    currentTab: OcpDashboardTab.accounts,
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
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&filter[limit]=5&group_by[account]=*',
    ],
    [{}, 'group_by[account]=*'],
    [{ limit: 5 }, 'filter[limit]=5&group_by[account]=*'],
  ].forEach(value => {
    expect(getQueryForWidget(widget, value[0])).toEqual(value[1]);
  });
});
