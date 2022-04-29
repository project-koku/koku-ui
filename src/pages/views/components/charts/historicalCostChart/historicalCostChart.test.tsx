jest.mock('date-fns/format');

import { render, screen } from "@testing-library/react";
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import * as utils from 'pages/views/components/charts/common/chartDatumUtils';
import React from 'react';

import { HistoricalCostChart, HistoricalCostChartProps } from './historicalCostChart';

const currentMonthReport: OcpReport = createReport('1-15-18');
const previousMonthReport: OcpReport = createReport('12-15-17');

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
  render(<HistoricalCostChart {...props} />);
  const charts = screen.getAllByText(/cost/i);
  expect(charts.length).toBe(4);
  //check parent container of all charts
  expect(charts[0].closest('g')).toMatchSnapshot();
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
  expect(screen.getByTestId('historical-chart-wrapper').getAttribute('style')).toContain("height: 100px");
});

//TODO: enzyme - the following two tests are giving me a "Nan for 'y' attribute" warning that i can't track down.
// test('trend is a running total', () => {
//   const multiDayReport: OcpReport = {
//     data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
//   };
//   render(<HistoricalCostChart {...props} currentCostData={multiDayReport.data} />);
//   const charts = screen.getAllByText(/cost/i);
//   expect(charts.at(1)).toMatchSnapshot();
// });

// test('trend is a daily value', () => {
//   const multiDayReport: OcpReport = {
//     data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
//   };
//   render(<HistoricalCostChart {...props} currentCostData={multiDayReport.data} />);
//   const charts = screen.getAllByText(/cost/i);
//   expect(charts.at(1)).toMatchSnapshot();
// });

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
