import { render, screen } from '@testing-library/react';
import type { OcpReport, OcpReportData } from '@koku-ui/api/reports/ocpReports';
import React from 'react';
import * as utils from '../common/chartDatum';

import type { UsageChartProps } from './usageChart';
import UsageChart from './usageChart';

const currentMonthReport: OcpReport = createReport('2018-01-15');
const previousMonthReport: OcpReport = createReport('2017-12-15');

const currentRequestData = utils.transformReport(currentMonthReport, utils.DatumType.rolling, 'date', 'request');
const currentUsageData = utils.transformReport(currentMonthReport, utils.DatumType.rolling, 'date', 'usage');
const previousRequestData = utils.transformReport(previousMonthReport, utils.DatumType.rolling, 'date', 'request');
const previousUsageData = utils.transformReport(previousMonthReport, utils.DatumType.rolling, 'date', 'usage');

const props: UsageChartProps = {
  baseHeight: 100,
  currentRequestData,
  currentUsageData,
  formatter: jest.fn(),
  formatOptions: {},
  intl: null,
  name: 'exampleUsageChart',
  previousRequestData,
  previousUsageData,
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
