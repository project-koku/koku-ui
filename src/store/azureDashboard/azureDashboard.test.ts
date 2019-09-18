jest.mock('store/azureReports/azureReportsActions');

import { AzureReportType } from 'api/azureReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { azureReportsActions } from 'store/azureReports';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './azureDashboardActions';
import {
  azureDashboardStateKey,
  AzureDashboardTab,
  getGroupByForTab,
  getQueryForWidgetTabs,
} from './azureDashboardCommon';
import { azureDashboardReducer } from './azureDashboardReducer';
import * as selectors from './azureDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './azureDashboardWidgets';

const createAzureDashboardStore = createMockStoreCreator({
  [azureDashboardStateKey]: azureDashboardReducer,
});

const fetchReportMock = azureReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureDashboardStore();
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
  const store = createAzureDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAzureDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, AzureDashboardTab.regions)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AzureDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(AzureDashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(getGroupByForTab(AzureDashboardTab.instanceType)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(AzureDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(AzureDashboardTab.regions)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: AzureReportType.cost,
    availableTabs: [AzureDashboardTab.accounts],
    currentTab: AzureDashboardTab.accounts,
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
