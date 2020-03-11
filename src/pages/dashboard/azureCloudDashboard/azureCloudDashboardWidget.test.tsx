jest
  .mock('date-fns/start_of_month')
  .mock('date-fns/get_date')
  .mock('date-fns/format')
  .mock('date-fns/get_month');

import { AzureReportType } from 'api/azureReports';
import { ChartType } from 'components/charts/common/chartUtils';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import { AzureCloudDashboardTab } from 'store/dashboard/azureCloudDashboard';
import { mockDate } from 'testUtils';
import {
  AzureCloudDashboardWidgetBase,
  AzureCloudDashboardWidgetProps,
  getIdKeyForTab,
} from './azureCloudDashboardWidget';

const props: AzureCloudDashboardWidgetProps = {
  widgetId: 1,
  id: 1,
  t: jest.fn(v => v),
  current: { data: [] },
  previous: { data: [] },
  tabs: { data: [] },
  fetchReports: jest.fn(),
  updateTab: jest.fn(),
  titleKey: 'title',
  reportType: AzureReportType.cost,
  trend: {
    type: ChartType.rolling,
    titleKey: 'trend title',
    formatOptions: {},
  },
  status: FetchStatus.none,
  currentQuery: '',
  previousQuery: '',
  tabsQuery: '',
  details: {
    labelKey: 'detail label',
    labelKeyContext: 'label context',
    descriptionKeyRange: 'detail description range',
    descriptionKeySingle: 'detail description single',
    formatOptions: {},
  },
  topItems: { formatOptions: {} },
  availableTabs: [AzureCloudDashboardTab.subscription_guids],
  currentTab: AzureCloudDashboardTab.subscription_guids,
};

const getDateMock = getDate as jest.Mock;
const formatDateMock = formatDate as jest.Mock;
const startOfMonthMock = startOfMonth as jest.Mock;
const getMonthMock = getMonth as jest.Mock;

beforeEach(() => {
  mockDate();
  getDateMock.mockReturnValue(1);
  formatDateMock.mockReturnValue('formated date');
  startOfMonthMock.mockReturnValue(1);
  getMonthMock.mockReturnValue(1);
});

test('reports are fetched on mount', () => {
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(props.fetchReports).toBeCalledWith(props.widgetId);
});

test('title is translated', () => {
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.titleKey)).toMatchSnapshot();
});

test('detail label is translated', () => {
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.details.labelKey)).toMatchSnapshot();
});

test('subtitle is translated with single date', () => {
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(
    getTranslateCallForKey('azure_dashboard.widget_subtitle')
  ).toMatchSnapshot();
});

test('subtitle is translated with date range', () => {
  getDateMock.mockReturnValueOnce(2);
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(
    getTranslateCallForKey('azure_dashboard.widget_subtitle')
  ).toMatchSnapshot();
});

test('trend title is translated', () => {
  shallow(<AzureCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.trend.titleKey)).toMatchSnapshot();
});

test('id key for dashboard tab is the tab name in singular form', () => {
  [
    AzureCloudDashboardTab.service_names,
    AzureCloudDashboardTab.subscription_guids,
    AzureCloudDashboardTab.resource_locations,
  ].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(AzureCloudDashboardTab.instanceType)).toEqual(
    AzureCloudDashboardTab.instanceType
  );
});

function getTranslateCallForKey(key: string) {
  return (props.t as jest.Mock).mock.calls.find(([k]) => k === key);
}
