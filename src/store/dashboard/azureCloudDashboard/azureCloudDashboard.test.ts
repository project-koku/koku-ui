jest.mock('store/azureReports/azureReportsActions');

import { AzureReportType } from 'api/azureReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { azureReportsActions } from 'store/azureReports';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './azureCloudDashboardActions';
import {
  azureCloudDashboardStateKey,
  AzureCloudDashboardTab,
  getGroupByForTab,
  getQueryForWidgetTabs,
} from './azureCloudDashboardCommon';
import { azureCloudDashboardReducer } from './azureCloudDashboardReducer';
import * as selectors from './azureCloudDashboardSelectors';
import {
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './azureCloudDashboardWidgets';

const createAzureCloudDashboardStore = createMockStoreCreator({
  [azureCloudDashboardStateKey]: azureCloudDashboardReducer,
});

const fetchReportMock = azureReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureCloudDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    virtualMachineWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createAzureCloudDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAzureCloudDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(
      costSummaryWidget.id,
      AzureCloudDashboardTab.resource_locations
    )
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AzureCloudDashboardTab.resource_locations);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(
      getGroupByForTab(AzureCloudDashboardTab.service_names)
    ).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(
      getGroupByForTab(AzureCloudDashboardTab.instanceType)
    ).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(
      getGroupByForTab(AzureCloudDashboardTab.subscription_guids)
    ).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(
      getGroupByForTab(AzureCloudDashboardTab.resource_locations)
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
    reportType: AzureReportType.cost,
    availableTabs: [AzureCloudDashboardTab.subscription_guids],
    currentTab: AzureCloudDashboardTab.subscription_guids,
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
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&group_by[subscription_guid]=*',
    ],
    [{}, 'group_by[subscription_guid]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[subscription_guid]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
