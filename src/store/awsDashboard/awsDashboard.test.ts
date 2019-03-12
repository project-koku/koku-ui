jest.mock('store/awsReports/awsReportsActions');

import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { awsReportsActions } from 'store/awsReports';
import { createMockStoreCreator } from 'store/mockStore';
import * as actions from './awsDashboardActions';
import {
  awsDashboardStateKey,
  AwsDashboardTab,
  getGroupByForTab,
  getQueryForWidget,
} from './awsDashboardCommon';
import { awsDashboardReducer } from './awsDashboardReducer';
import * as selectors from './awsDashboardSelectors';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  storageWidget,
} from './awsDashboardWidgets';

const createAwsDashboardStore = createMockStoreCreator({
  [awsDashboardStateKey]: awsDashboardReducer,
});

const fetchReportMock = awsReportsActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createAwsDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(
    costSummaryWidget
  );
});

test('fetch widget reports', () => {
  const store = createAwsDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAwsDashboardStore();
  store.dispatch(
    actions.changeWidgetTab(costSummaryWidget.id, AwsDashboardTab.regions)
  );
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AwsDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(AwsDashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(getGroupByForTab(AwsDashboardTab.instanceType)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(AwsDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(AwsDashboardTab.regions)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: AwsReportType.cost,
    availableTabs: [AwsDashboardTab.accounts],
    currentTab: AwsDashboardTab.accounts,
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
    [{ limit: 5 }, 'filter[limit]=5&group_by[account]=*'],
  ].forEach(value => {
    expect(getQueryForWidget(widget, value[0])).toEqual(value[1]);
  });
});
