import { render, screen } from '@testing-library/react';
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import React from 'react';
import * as utils from 'routes/views/components/charts/common/chartDatumUtils';

import { HistoricalUsageChart, HistoricalUsageChartProps } from './historicalUsageChart';

const currentMonthReport: OcpReport = createReport('2018-01-15');
const previousMonthReport: OcpReport = createReport('2017-12-15');

const currentRequestData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'request');
const currentUsageData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'usage');
const previousRequestData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'request');
const previousUsageData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'usage');

const props: HistoricalUsageChartProps = {
  currentRequestData,
  currentUsageData,
  intl: null,
  height: 100,
  previousRequestData,
  previousUsageData,
  title: 'Usage Title',
  formatter: jest.fn(),
  formatOptions: {},
};

test('reports are formatted to datums', () => {
  render(<HistoricalUsageChart {...props} />);
  /* eslint-disable-next-line testing-library/no-node-access */
  expect(screen.getByText(props.title).parentElement).toMatchSnapshot();
  expect(screen.getAllByText(/no data/i).length).toBe(2);
});

test('null previous and current reports are handled', () => {
  render(
    <HistoricalUsageChart
      {...props}
      currentRequestData={null}
      currentUsageData={null}
      previousRequestData={null}
      previousUsageData={null}
    />
  );
  expect(screen.getAllByText(/no data/i).length).toBe(6);
});

test('height from props is used', () => {
  render(<HistoricalUsageChart {...props} />);
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain('height: 100px');
});

function createReport(date: string): OcpReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, usage = 1): OcpReportData {
  return {
    date,
    values: [{ date, usage: { value: usage, units: 'unit' } }],
  };
}
