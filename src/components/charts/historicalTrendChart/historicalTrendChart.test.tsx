jest.mock('date-fns/format');

import { Chart, ChartArea } from '@patternfly/react-charts';
import { AwsReport, AwsReportData } from 'api/reports/awsReports';
import * as utils from 'components/charts/common/chartUtils';
import { shallow } from 'enzyme';
import React from 'react';
import {
  HistoricalTrendChart,
  HistoricalTrendChartProps,
} from './historicalTrendChart';

const currentMonthReport: AwsReport = createReport('1-15-18');
const previousMonthReport: AwsReport = createReport('12-15-17');

const currentData = utils.transformReport(
  currentMonthReport,
  utils.ChartType.daily
);
const previousData = utils.transformReport(
  previousMonthReport,
  utils.ChartType.daily
);

const props: HistoricalTrendChartProps = {
  title: 'Trend Title',
  height: 100,
  formatDatumValue: jest.fn(),
  currentData,
  previousData,
  formatDatumOptions: {},
};

test('reports are formatted to datums', () => {
  const view = shallow(<HistoricalTrendChart {...props} />);
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(2);
  expect(charts.at(0).prop('data')).toMatchSnapshot('previous month data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <HistoricalTrendChart {...props} currentData={null} previousData={null} />
  );
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(2);
});

test('height from props is used', () => {
  const view = shallow(<HistoricalTrendChart {...props} />);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const tooltipFormatMock = jest.spyOn(utils, 'getTooltipContent');
  const formatLabel = jest.fn();
  tooltipFormatMock.mockImplementation(() => formatLabel);

  const view = shallow(<HistoricalTrendChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'units',
  };
  const group = view.find(Chart);
  group.props().containerComponent.props.labels({ datum });
  expect(formatLabel).toBeCalledWith(
    datum.y,
    datum.units,
    props.formatDatumOptions
  );
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('trend is a running total', () => {
  const multiDayReport: AwsReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const multiDaytData = utils.transformReport(
    multiDayReport,
    utils.ChartType.daily
  );
  const view = shallow(
    <HistoricalTrendChart {...props} currentData={multiDaytData} />
  );
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('trend is a daily value', () => {
  const multiDayReport: AwsReport = {
    data: [
      createReportDataPoint('1-15-18', 1),
      createReportDataPoint('1-16-18', 2),
    ],
  };
  const multiDaytData = utils.transformReport(
    multiDayReport,
    utils.ChartType.daily
  );
  const view = shallow(
    <HistoricalTrendChart {...props} currentData={multiDaytData} />
  );
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

function createReport(date: string): AwsReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, total = 1): AwsReportData {
  return {
    date,
    values: [{ date, cost: { value: total, units: 'unit' } }],
  };
}
