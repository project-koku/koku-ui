jest.mock('date-fns/format');

import { ChartArea, ChartBar, ChartGroup } from '@patternfly/react-charts';
import { OcpReport, OcpReportData } from 'api/ocpReports';
import * as utils from 'components/commonChart/chartUtils';
import formatDate from 'date-fns/format';
import { shallow } from 'enzyme';
import React from 'react';
import { UsageChart, UsageChartProps } from './usageChart';

const currentMonthReport: OcpReport = createReport('1-15-18');
const previousMonthReport: OcpReport = createReport('12-15-17');

const currentData = utils.transformOcpReport(
  currentMonthReport,
  utils.ChartType.daily,
  'usage'
);
const requestData = utils.transformOcpReport(
  previousMonthReport,
  utils.ChartType.daily,
  'request'
);

jest.spyOn(utils, 'getTooltipLabel');

const getTooltipLabel = utils.getTooltipLabel as jest.Mock;

const props: UsageChartProps = {
  title: 'Usage Title',
  height: 100,
  formatDatumValue: jest.fn(),
  currentData,
  formatDatumOptions: {},
  requestData,
};

test('reports are formatted to datums', () => {
  const view = shallow(<UsageChart {...props} />);
  const areaCharts = view.find(ChartArea);
  const barCharts = view.find(ChartBar);
  expect(areaCharts.length).toBe(1);
  expect(areaCharts.at(1).prop('data')).toMatchSnapshot('request data');
  expect(barCharts.length).toBe(1);
  expect(barCharts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <UsageChart {...props} currentData={null} requestData={null} />
  );
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(0);
});

test('height from props is used', () => {
  const view = shallow(<UsageChart {...props} />);
  expect(view.find(ChartGroup).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const view = shallow(<UsageChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'units',
  };
  const group = view.find(ChartGroup);
  group.props().containerComponent.props.labels(datum);
  expect(getTooltipLabel).toBeCalledWith(
    datum,
    props.formatDatumValue,
    props.formatDatumOptions,
    'date'
  );
  expect(props.formatDatumValue).toBeCalledWith(
    datum.y,
    datum.units,
    props.formatDatumOptions
  );
  expect(formatDate).toBeCalledWith(datum.key, expect.any(String));
  expect(view.find(ChartGroup).prop('height')).toBe(props.height);
});

test('labels ignores datums without a date', () => {
  const view = shallow(<UsageChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '',
    units: 'units',
  };
  const group = view.find(ChartGroup);
  const value = group.props().containerComponent.props.labels(datum);
  expect(value).toBe('');
  expect(props.formatDatumValue).not.toBeCalled();
});

test('trend is a running total', () => {
  const multiDayReport: OcpReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const view = shallow(<UsageChart {...props} currentData={multiDayReport} />);
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('trend is a daily value', () => {
  const multiDayReport: OcpReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const view = shallow(<UsageChart {...props} currentData={multiDayReport} />);
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
