jest.mock('store/reports/reportActions');

import { ReportType } from '@koku-ui/api/reports/report';
import { DatumType } from '../../../routes/components/charts/common/chartDatum';
import { createMockStoreCreator } from '../../mockStore';
import { reportActions } from '../../reports';

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
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './azureDashboardWidgets';

const createAzureDashboardStore = createMockStoreCreator({
  [azureDashboardStateKey]: azureDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAzureDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    virtualMachineWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createAzureDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAzureDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, AzureDashboardTab.resource_locations));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AzureDashboardTab.resource_locations);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    const widget = getGroupByForTab({
      currentTab: AzureDashboardTab.service_names,
    });
    expect(widget).toMatchSnapshot();
  });

  test('accounts tab', () => {
    const widget = getGroupByForTab({
      currentTab: AzureDashboardTab.subscription_guids,
    });
    expect(widget).toMatchSnapshot();
  });

  test('regions tab', () => {
    const widget = getGroupByForTab({
      currentTab: AzureDashboardTab.resource_locations,
    });
    expect(widget).toMatchSnapshot();
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
    availableTabs: [AzureDashboardTab.subscription_guids],
    currentTab: AzureDashboardTab.subscription_guids,
    details: { formatOptions: {} },
    trend: {
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
      'filter[resolution]=daily&filter[time_scope_units]=month&filter[time_scope_value]=-1&group_by[subscription_guid]=*',
    ],
    [{}, 'group_by[subscription_guid]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[subscription_guid]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
