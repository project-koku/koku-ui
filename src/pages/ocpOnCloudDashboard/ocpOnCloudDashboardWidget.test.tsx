jest
  .mock('date-fns/start_of_month')
  .mock('date-fns/get_date')
  .mock('date-fns/format')
  .mock('date-fns/get_month');

import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import { OcpOnCloudDashboardTab } from 'store/ocpOnCloudDashboard';
import { mockDate } from 'testUtils';
import {
  getIdKeyForTab,
  OcpOnCloudDashboardWidgetBase,
  OcpOnCloudDashboardWidgetProps,
} from './ocpOnCloudDashboardWidget';

const props: OcpOnCloudDashboardWidgetProps = {
  widgetId: 1,
  id: 1,
  t: jest.fn(v => v),
  current: { data: [] },
  previous: { data: [] },
  tabs: { data: [] },
  fetchReports: jest.fn(),
  updateTab: jest.fn(),
  titleKey: 'title',
  reportType: OcpOnCloudReportType.cost,
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
  availableTabs: [OcpOnCloudDashboardTab.projects],
  currentTab: OcpOnCloudDashboardTab.projects,
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
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(props.fetchReports).toBeCalledWith(props.widgetId);
});

test('title is translated', () => {
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.titleKey)).toMatchSnapshot();
});

test('detail label is translated', () => {
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.details.unitsKey)).toMatchSnapshot();
});

test('subtitle is translated with single date', () => {
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(
    getTranslateCallForKey('ocp_on_cloud_dashboard.widget_subtitle')
  ).toMatchSnapshot();
});

test('subtitle is translated with date range', () => {
  getDateMock.mockReturnValueOnce(2);
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(
    getTranslateCallForKey('ocp_on_cloud_dashboard.widget_subtitle')
  ).toMatchSnapshot();
});

test('trend title is translated', () => {
  shallow(<OcpOnCloudDashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.trend.titleKey)).toMatchSnapshot();
});

test('id key for dashboard tab is the tab name in singular form', () => {
  [
    OcpOnCloudDashboardTab.clusters,
    OcpOnCloudDashboardTab.nodes,
    OcpOnCloudDashboardTab.projects,
  ].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OcpOnCloudDashboardTab.projects)).toEqual('project');
});

function getTranslateCallForKey(key: string) {
  return (props.t as jest.Mock).mock.calls.find(([k]) => k === key);
}
