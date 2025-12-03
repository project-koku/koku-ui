import { render, screen } from '@testing-library/react';
import type { AwsReport, AwsReportData } from '@koku-ui/api/reports/awsReports';
import React from 'react';
import * as utils from '../common/chartDatum';

import type { HistoricalTrendChartProps } from './historicalTrendChart';
import HistoricalTrendChart from './historicalTrendChart';

const currentMonthReport: AwsReport = createReport('2018-01-01');
const previousMonthReport: AwsReport = createReport('2017-12-01');

const currentData = utils.transformReport(currentMonthReport, utils.DatumType.rolling);
const previousData = utils.transformReport(previousMonthReport, utils.DatumType.rolling);

const props: HistoricalTrendChartProps = {
  baseHeight: 100,
  currentData,
  formatter: jest.fn(),
  formatOptions: {},
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
