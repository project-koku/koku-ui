jest.mock('date-fns/format');

import { Chart, ChartArea } from '@patternfly/react-charts';
import { AwsReport, AwsReportData } from 'api/awsReports';
import * as utils from 'components/charts/commonChart/chartUtils';
import formatDate from 'date-fns/format';
import { shallow } from 'enzyme';
import React from 'react';
import { CostChart, CostChartProps } from './costChart';

const currentMonthReport: AwsReport = createReport('1-15-18');
const previousMonthReport: AwsReport = createReport('12-15-17');

const currentUsageData = utils.transformAwsReport(
  currentMonthReport,
  utils.ChartType.daily
);
const previousUsageData = utils.transformAwsReport(
  previousMonthReport,
  utils.ChartType.daily
);

jest.spyOn(utils, 'getTooltipLabel');

const getTooltipLabel = utils.getTooltipLabel as jest.Mock;

const props: CostChartProps = {
  title: 'Infrastructure Title',
  height: 100,
  formatDatumValue: jest.fn(),
  currentUsageData,
  previousUsageData,
  formatDatumOptions: {},
};

test('reports are formatted to datums', () => {
  const view = shallow(<CostChart {...props} />);
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(2);
  expect(charts.at(0).prop('data')).toMatchSnapshot('previous month data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <CostChart {...props} currentUsageData={null} previousUsageData={null} />
  );
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(0);
});

test('height from props is used', () => {
  const view = shallow(<CostChart {...props} />);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const tooltipFormatMock = jest.spyOn(utils, 'getTooltipContent');
  const formatLabel = jest.fn();
  tooltipFormatMock.mockImplementation(() => formatLabel);

  const view = shallow(<CostChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'units',
  };
  const group = view.find(Chart);
  group.props().containerComponent.props.labels(datum);
  expect(getTooltipLabel).toBeCalledWith(
    datum,
    formatLabel,
    props.formatDatumOptions,
    'date'
  );
  expect(formatLabel).toBeCalledWith(
    datum.y,
    datum.units,
    props.formatDatumOptions
  );
  expect(formatDate).toBeCalledWith(datum.key, expect.any(String));
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('labels ignores datums without a date', () => {
  const view = shallow(<CostChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '',
    units: 'units',
  };
  const group = view.find(Chart);
  const value = group.props().containerComponent.props.labels(datum);
  expect(value).toBe('');
  expect(props.formatDatumValue).not.toBeCalled();
});

test('infrastructure is a running total', () => {
  const multiDayReport: AwsReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const multiDaytData = utils.transformAwsReport(
    multiDayReport,
    utils.ChartType.daily
  );
  const view = shallow(
    <CostChart {...props} currentUsageData={multiDaytData} />
  );
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('infrastructure is a daily value', () => {
  const multiDayReport: AwsReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const multiDaytData = utils.transformAwsReport(
    multiDayReport,
    utils.ChartType.daily
  );
  const view = shallow(
    <CostChart {...props} currentUsageData={multiDaytData} />
  );
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

function createReport(date: string): AwsReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, cost = 1): AwsReportData {
  const item = { value: cost, units: 'unit' };
  return {
    date,
    values: [{ date, cost: item }],
  };
}
