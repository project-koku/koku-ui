jest.mock('store/reports/reportActions');

import { ReportType } from '@koku-ui/api/reports/report';
import { ComputedReportItemType, DatumType } from '../../../routes/components/charts/common/chartDatum';
import { createMockStoreCreator } from '../../mockStore';
import { reportActions } from '../../reports';

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

const fetchReportMock = reportActions.fetchReport as jest.Mock;

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
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createOcpCloudDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createOcpCloudDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, OcpCloudDashboardTab.regions));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(OcpCloudDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.services)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(OcpCloudDashboardTab.regions)).toMatchSnapshot();
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
    availableTabs: [OcpCloudDashboardTab.accounts],
    currentTab: OcpCloudDashboardTab.accounts,
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
      'filter[resolution]=daily&filter[time_scope_units]=month&filter[time_scope_value]=-1&group_by[account]=*',
    ],
    [{}, 'group_by[account]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[account]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
