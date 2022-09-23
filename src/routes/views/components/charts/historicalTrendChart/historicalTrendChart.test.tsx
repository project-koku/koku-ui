import { render, screen } from '@testing-library/react';
import { AwsReport, AwsReportData } from 'api/reports/awsReports';
import React from 'react';
import * as utils from 'routes/views/components/charts/common/chartDatumUtils';

import { HistoricalTrendChart, HistoricalTrendChartProps } from './historicalTrendChart';

const currentMonthReport: AwsReport = createReport('2018-01-01');
const previousMonthReport: AwsReport = createReport('2017-12-01');

const currentData = utils.transformReport(currentMonthReport, utils.ChartType.daily);
const previousData = utils.transformReport(previousMonthReport, utils.ChartType.daily);

const props: HistoricalTrendChartProps = {
  currentData,
  formatter: jest.fn(),
  formatOptions: {},
  height: 100,
  intl: null,
  name: 'exampleTrendChart',
  previousData,
  title: 'Trend Title',
};

/* eslint-disable testing-library/no-node-access */

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
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain('height: 100px');
});

function createReport(date: string): AwsReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, total = 1): AwsReportData {
  return {
    date,
    values: [
      { date, cost: { value: total, units: 'unit' } },
      { date, cost: { value: total, units: 'unit' } },
    ],
  };
}
