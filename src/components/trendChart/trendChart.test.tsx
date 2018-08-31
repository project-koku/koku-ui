jest.mock('date-fns/format');

import { Report, ReportData } from 'api/reports';
import { ChartLegendItem, ChartTitle } from 'components/commonChart';
import * as utils from 'components/commonChart/chartUtils';
import formatDate from 'date-fns/format';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import {
  VictoryArea,
  VictoryGroup,
  VictoryVoronoiContainerProps,
} from 'victory';
import { TrendChart, TrendChartProps } from './trendChart';

const currentMonthReport: Report = createReport('1-15-18');
const previousMonthReport: Report = createReport('12-15-17');

jest.spyOn(utils, 'transformReport');
jest.spyOn(utils, 'getTooltipLabel');

const transformReport = utils.transformReport as jest.Mock;
const getTooltipLabel = utils.getTooltipLabel as jest.Mock;

const props: TrendChartProps = {
  title: 'Trend Title',
  height: 100,
  formatDatumValue: jest.fn(),
  current: currentMonthReport,
  previous: previousMonthReport,
  formatDatumOptions: {},
  type: utils.ChartType.rolling,
};

test('reports are formatted to datums', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(transformReport).toBeCalledWith(currentMonthReport, props.type);
  expect(transformReport).toBeCalledWith(previousMonthReport, props.type);
  const charts = view.find(VictoryArea);
  expect(charts.length).toBe(2);
  expect(charts.at(0).prop('data')).toMatchSnapshot('previous month data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <TrendChart {...props} current={null} previous={null} />
  );
  expect(transformReport).toBeCalledWith(null, props.type);
  expect(transformReport).toBeCalledWith(null, props.type);
  const charts = view.find(VictoryArea);
  expect(charts.length).toBe(0);
});

test('legends are created for current and previous data', () => {
  const view = shallow(<TrendChart {...props} />);
  const legends = view.find(ChartLegendItem);
  expect(legends.length).toBe(2);
  expect(legends.at(0).prop('data')).toMatchSnapshot('current month data');
  expect(legends.at(1).prop('data')).toMatchSnapshot('previous month data');
});

test('chart title is displayed and passed to chart container', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(view.find(ChartTitle).prop('children')).toBe(props.title);
  expect(getChartContainerProps(view).title).toBe(props.title);
});

test('height from props is used', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(view.find(VictoryGroup).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const view = shallow(<TrendChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'units',
  };
  getChartContainerProps(view).labels(datum);
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
  expect(view.find(VictoryGroup).prop('height')).toBe(props.height);
});

test('labels ignores datums without a date', () => {
  const view = shallow(<TrendChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '',
    units: 'units',
  };
  const value = getChartContainerProps(view).labels(datum);
  expect(value).toBe('');
  expect(props.formatDatumValue).not.toBeCalled();
  expect(formatDate).not.toBeCalled();
});

test('trend is a running total', () => {
  const multiDayReport: Report = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const view = shallow(<TrendChart {...props} current={multiDayReport} />);
  const charts = view.find(VictoryArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('trend is a daily value', () => {
  const multiDayReport: Report = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const view = shallow(
    <TrendChart
      {...props}
      current={multiDayReport}
      type={utils.ChartType.daily}
    />
  );
  const charts = view.find(VictoryArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

function getChartContainerProps(
  view: ShallowWrapper
): VictoryVoronoiContainerProps {
  const group = view.find(VictoryGroup);
  return group.props().containerComponent.props;
}

function createReport(date: string): Report {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, total = 1): ReportData {
  return {
    date,
    values: [{ date, total, units: 'unit' }],
  };
}
