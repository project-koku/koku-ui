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

const currentRequestData = utils.transformOcpReport(
  currentMonthReport,
  utils.ChartType.daily,
  'date',
  'request'
);
const currentUsageData = utils.transformOcpReport(
  currentMonthReport,
  utils.ChartType.daily,
  'date',
  'usage'
);
const previousRequestData = utils.transformOcpReport(
  previousMonthReport,
  utils.ChartType.daily,
  'date',
  'request'
);
const previousUsageData = utils.transformOcpReport(
  previousMonthReport,
  utils.ChartType.daily,
  'date',
  'usage'
);

jest.spyOn(utils, 'getTooltipLabel');

const getTooltipLabel = utils.getTooltipLabel as jest.Mock;

const props: UsageChartProps = {
  currentRequestData,
  currentUsageData,
  height: 100,
  formatDatumValue: jest.fn(),
  formatDatumOptions: {},
  previousRequestData,
  previousUsageData,
  title: 'Usage Title',
};

test('reports are formatted to datums', () => {
  const view = shallow(<UsageChart {...props} />);
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(4);
  expect(charts.at(0).prop('data')).toMatchSnapshot('current month usage data');
  expect(charts.at(1).prop('data')).toMatchSnapshot(
    'current month request data'
  );
  expect(charts.at(2).prop('data')).toMatchSnapshot(
    'previous month usage data'
  );
  expect(charts.at(3).prop('data')).toMatchSnapshot(
    'previous month request data'
  );
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
    expect.any(Function),
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
  const view = shallow(
    <UsageChart {...props} currentUsageData={multiDayReport} />
  );
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
  const view = shallow(
    <UsageChart {...props} currentUsageData={multiDayReport} />
  );
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
