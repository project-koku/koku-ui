jest.mock('date-fns/format');

import { Chart, ChartArea } from '@patternfly/react-charts';
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import * as utils from 'components/charts/common/chartDatumUtils';
import { shallow } from 'enzyme';
import React from 'react';

import { UsageChart, UsageChartProps } from './usageChart';

const currentMonthReport: OcpReport = createReport('1-15-18');
const previousMonthReport: OcpReport = createReport('12-15-17');

const currentRequestData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'request');
const currentUsageData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'usage');
const previousRequestData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'request');
const previousUsageData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'usage');

const props: UsageChartProps = {
  currentRequestData,
  currentUsageData,
  height: 100,
  formatDatumValue: jest.fn(),
  formatDatumOptions: {},
  previousRequestData,
  previousUsageData,
};

test('reports are formatted to datums', () => {
  const view = shallow(<UsageChart {...props} />);
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(4);
  expect(charts.at(0).prop('data')).toMatchSnapshot('current month usage data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month request data');
  expect(charts.at(2).prop('data')).toMatchSnapshot('previous month usage data');
  expect(charts.at(3).prop('data')).toMatchSnapshot('previous month request data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <UsageChart
      {...props}
      currentRequestData={null}
      currentUsageData={null}
      previousRequestData={null}
      previousUsageData={null}
    />
  );
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(4);
});

test('height from props is used', () => {
  const view = shallow(<UsageChart {...props} />);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const view = shallow(<UsageChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'units',
  };
  const group = view.find(Chart);
  group.props().containerComponent.props.labels({ datum });
  expect(props.formatDatumValue).toBeCalledWith(datum.y, datum.units, props.formatDatumOptions);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('trend is a running total', () => {
  const multiDayReport: OcpReport = {
    data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
  };
  const view = shallow(<UsageChart {...props} currentUsageData={multiDayReport.data} />);
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('trend is a daily value', () => {
  const multiDayReport: OcpReport = {
    data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
  };
  const view = shallow(<UsageChart {...props} currentUsageData={multiDayReport.data} />);
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

function createReport(date: string): OcpReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, usage = 1): OcpReportData {
  return {
    date,
    values: [{ date, usage, units: 'unit' }],
  };
}
