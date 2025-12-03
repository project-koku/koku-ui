import { render, screen } from '@testing-library/react';
import type { OcpReport, OcpReportData } from '@koku-ui/api/reports/ocpReports';
import React from 'react';
import * as utils from '../common/chartDatum';

import type { HistoricalUsageChartProps } from './historicalUsageChart';
import HistoricalUsageChart from './historicalUsageChart';

const currentMonthReport: OcpReport = createReport('2018-01-15');
const previousMonthReport: OcpReport = createReport('2017-12-15');

const currentRequestData = utils.transformReport(currentMonthReport, utils.DatumType.rolling, 'date', 'request');
const currentUsageData = utils.transformReport(currentMonthReport, utils.DatumType.rolling, 'date', 'usage');
const previousRequestData = utils.transformReport(previousMonthReport, utils.DatumType.rolling, 'date', 'request');
const previousUsageData = utils.transformReport(previousMonthReport, utils.DatumType.rolling, 'date', 'usage');

const props: HistoricalUsageChartProps = {
  baseHeight: 100,
  currentRequestData,
  currentUsageData,
  formatter: jest.fn(),
  formatOptions: {},
  intl: null,
  name: 'exampleUsageChart',
  previousRequestData,
  previousUsageData,
  showLimit: true,
  showRequest: true,
  title: 'Usage Title',
};

test('reports are formatted to datums', () => {
  render(<HistoricalUsageChart {...props} />);
  /* eslint-disable-next-line testing-library/no-node-access */
  expect(screen.getByText(props.title).parentElement).toMatchSnapshot();
  expect(screen.getAllByText(/no data/i).length).toBe(4);
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
