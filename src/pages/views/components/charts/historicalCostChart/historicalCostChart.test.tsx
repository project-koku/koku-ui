import { render, screen } from '@testing-library/react';
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import * as utils from 'pages/views/components/charts/common/chartDatumUtils';
import React from 'react';

import { HistoricalCostChart, HistoricalCostChartProps } from './historicalCostChart';

const currentMonthReport: OcpReport = createReport('2018-01-15');
const previousMonthReport: OcpReport = createReport('2017-12-15');

const currentCostData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'cost');
const currentInfrastructureCostData = utils.transformReport(
  currentMonthReport,
  utils.ChartType.daily,
  'date',
  'infrastructure'
);
const previousCostData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'cost');
const previousInfrastructureCostData = utils.transformReport(
  previousMonthReport,
  utils.ChartType.daily,
  'date',
  'infrastructure'
);

const props: HistoricalCostChartProps = {
  currentCostData,
  currentInfrastructureCostData,
  height: 100,
  previousCostData,
  previousInfrastructureCostData,
  title: 'Usage Title',
  formatter: jest.fn(),
  formatOptions: {},
};

test('reports are formatted to datums', () => {
  const view = render(<HistoricalCostChart {...props} />);
  const charts = screen.getAllByText(/cost/i);
  expect(charts.length).toBe(4);
  expect(view.container).toMatchSnapshot();
});

test('null previous and current reports are handled', () => {
  render(
    <HistoricalCostChart
      {...props}
      currentCostData={null}
      currentInfrastructureCostData={null}
      previousCostData={null}
      previousInfrastructureCostData={null}
    />
  );
  const charts = screen.getAllByText(/cost/i);
  expect(charts.length).toBe(4);
});

test('height from props is used', () => {
  render(<HistoricalCostChart {...props} />);
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
