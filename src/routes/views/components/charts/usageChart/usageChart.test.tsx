import { render, screen } from '@testing-library/react';
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import * as utils from 'routes/views/components/charts/common/chartDatumUtils';
import React from 'react';

import { UsageChart, UsageChartProps } from './usageChart';

const currentMonthReport: OcpReport = createReport('2018-01-15');
const previousMonthReport: OcpReport = createReport('2017-12-15');

const currentRequestData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'request');
const currentUsageData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'usage');
const previousRequestData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'request');
const previousUsageData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'usage');

const props: UsageChartProps = {
  intl: null,
  currentRequestData,
  currentUsageData,
  height: 100,
  previousRequestData,
  previousUsageData,
  formatter: jest.fn(),
  formatOptions: {},
};

test('reports are formatted to datums', () => {
  render(<UsageChart {...props} />);
  expect(screen.getByTestId('usage-chart-wrapper')).toMatchSnapshot();
});

test('null previous and current reports are handled', () => {
  render(
    <UsageChart
      {...props}
      currentRequestData={null}
      currentUsageData={null}
      previousRequestData={null}
      previousUsageData={null}
    />
  );
  expect(screen.getAllByText(/no data/i).length).toBe(4);
});

test('height from props is used', () => {
  render(<UsageChart {...props} />);
  expect(screen.getByTestId('usage-chart-wrapper').getAttribute('style')).toContain('height: 100px');
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
