import { render, screen } from '@testing-library/react';
import { AwsReport, AwsReportData } from 'api/reports/awsReports';
import * as utils from 'pages/views/components/charts/common/chartDatumUtils';
import React from 'react';

import { HistoricalTrendChart, HistoricalTrendChartProps } from './historicalTrendChart';

const currentMonthReport: AwsReport = createReport('2018-01-01');
const previousMonthReport: AwsReport = createReport('2017-12-01');

const currentData = utils.transformReport(currentMonthReport, utils.ChartType.daily);
const previousData = utils.transformReport(previousMonthReport, utils.ChartType.daily);

const props: HistoricalTrendChartProps = {
  title: 'Trend Title',
  height: 100,
  currentData,
  intl: null,
  previousData,
  formatter: jest.fn(),
  formatOptions: {},
};

test('reports are formatted to datums', () => {
  render(<HistoricalTrendChart {...props} />);
  const chart = screen.getByText(props.title).parentElement;
  expect(chart).toMatchSnapshot();
});

test('null previous and current reports are handled', () => {
  render(<HistoricalTrendChart {...props} currentData={null} previousData={null} />);
  const chart = screen.getByText(props.title).parentElement;
  expect(chart).toMatchSnapshot();
});

test('height from props is used', () => {
  render(<HistoricalTrendChart {...props} />);
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain("height: 100px");
});

function createReport(date: string): AwsReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, total = 1): AwsReportData {
  return {
    date,
    values: [{ date, cost: { value: total, units: 'unit' } }, { date, cost: { value: total, units: 'unit' } }],
  };
}
