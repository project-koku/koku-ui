import { render, screen } from '@testing-library/react';
import React from 'react';
import ReportSummaryDetails from './reportSummaryDetails';
import { DashboardChartType } from '../../../../store/dashboard/common/dashboardCommon';
import { ReportType } from '@koku-ui/api/reports/report';

// Minimal intl mock
const intl: any = { formatMessage: ({ defaultMessage, id }, values) => defaultMessage || id || JSON.stringify(values) };

const baseReport = (over: any = {}) => ({
  meta: {
    total: {
      cost: { total: { units: 'USD', value: 10 } },
      supplementary: { total: { units: 'USD', value: 5 } },
      infrastructure: { total: { units: 'USD', value: 2 } },
      request: { units: 'HRS', value: 4 },
      usage: { units: 'HRS', value: 6 },
      count: { units: 'HRS' },
    },
  },
  ...over,
});

describe('ReportSummaryDetails', () => {
  test('renders cost layout for cost-like charts', () => {
    render(
      <ReportSummaryDetails
        chartType={DashboardChartType.dailyCost}
        costLabel="Cost"
        intl={intl}
        report={baseReport() as any}
        reportType={ReportType.cost}
      />
    );
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  test('renders trend with usage first', () => {
    render(
      <ReportSummaryDetails
        chartType={DashboardChartType.trend}
        costLabel="Cost"
        intl={intl}
        report={baseReport() as any}
        showUsageFirst
        usageLabel="Usage"
      />
    );
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  test('renders usage chart with request and usage blocks', () => {
    render(
      <ReportSummaryDetails
        chartType={DashboardChartType.usage}
        intl={intl}
        report={baseReport() as any}
        requestLabel="Request"
        usageLabel="Usage"
        showUnits
      />
    );
    expect(screen.getByText('Request')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });
}); 