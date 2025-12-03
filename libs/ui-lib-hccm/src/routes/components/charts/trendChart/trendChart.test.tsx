import { render, screen } from '@testing-library/react';
import type { AwsReport, AwsReportData } from '@koku-ui/api/reports/awsReports';
import React from 'react';
import * as utils from '../common/chartDatum';

import type { TrendChartProps } from './trendChart';
import TrendChart from './trendChart';

const currentMonthReport: AwsReport = createReport('2018-01-15');
const previousMonthReport: AwsReport = createReport('2017-12-15');

const currentData = utils.transformReport(currentMonthReport, utils.DatumType.rolling);
const previousData = utils.transformReport(previousMonthReport, utils.DatumType.rolling);

const props: TrendChartProps = {
  baseHeight: 100,
  currentData,
  formatter: jest.fn(),
  formatOptions: {},
  intl: null,
  name: 'exampleTrendChart',
  previousData,
  title: 'Example Trend Title',
};

test('reports are formatted to datums', () => {
  render(<TrendChart {...props} />);
  /* eslint-disable-next-line testing-library/no-node-access */
  expect(screen.getAllByText(props.title)[0].parentElement).toMatchSnapshot();
  expect(screen.queryByText(/no data/i)).toBeNull();
});

test('null previous and current reports are handled', () => {
  render(<TrendChart {...props} currentData={null} previousData={null} />);
  expect(screen.getAllByText(/no data/i).length).toBe(2);
});

test('height from props is used', () => {
  render(<TrendChart {...props} />);
  expect(screen.getByTestId('trend-chart-wrapper').getAttribute('style')).toContain('height: 100px');
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
