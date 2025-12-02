jest.mock('store/reports/reportActions');

import { ReportType } from '@koku-ui/api/reports/report';
import { DatumType } from '../../../routes/components/charts/common/chartDatum';
import { createMockStoreCreator } from '../../mockStore';
import { reportActions } from '../../reports';

import * as actions from './awsDashboardActions';
import { awsDashboardStateKey, AwsDashboardTab, getGroupByForTab, getQueryForWidgetTabs } from './awsDashboardCommon';
import { awsDashboardReducer } from './awsDashboardReducer';
import * as selectors from './awsDashboardSelectors';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './awsDashboardWidgets';

const createAwsDashboardStore = createMockStoreCreator({
  [awsDashboardStateKey]: awsDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

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
    networkWidget.id,
    databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createAwsDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createAwsDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, AwsDashboardTab.regions));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(AwsDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(AwsDashboardTab.services)).toMatchSnapshot();
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
    reportType: ReportType.cost,
    availableTabs: [AwsDashboardTab.accounts],
    currentTab: AwsDashboardTab.accounts,
    details: { formatOptions: {} },
    trend: {
      datumType: DatumType.rolling,
      titleKey: '',
      formatOptions: {},
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
