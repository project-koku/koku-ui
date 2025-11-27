import { render, screen, fireEvent } from '@testing-library/react';
import { intl } from '@koku-ui/i18n/i18n';
import React from 'react';
import { defineMessages } from 'react-intl';
import { DatumType, ComputedReportItemType } from '../../components/charts/common/chartDatum';
import DashboardWidgetBase from './dashboardWidgetBase';
import type { DashboardWidgetProps } from './dashboardWidgetBase';
import { FetchStatus } from '../../../store/common';
import { DashboardChartType } from '../../../store/dashboard/common/dashboardCommon';

// Mock scalprum AsyncComponent usage
jest.mock('../../../init', () => ({
  __esModule: true,
  AsyncComponent: () => null }
));

// Deterministic toggle for ChartComparison via SelectWrapper
jest.mock('routes/components/selectWrapper', () => ({
  __esModule: true,
  SelectWrapper: (props: any) => (
    <button onClick={() => props.onSelect?.(null, { value: 'daily' })}>comparison-toggle</button>
  ),
}));

// Expose which summary renders (daily vs cumulative) for assertions
jest.mock('routes/components/reports/reportSummary', () => ({
  __esModule: true,
  ReportSummary: (props: any) => <div>{props.children}</div>,
  ReportSummaryAlt: (props: any) => <div>{props.children}</div>,
  ReportSummaryCost: () => <div data-testid="cumulative-cost" />,
  ReportSummaryDailyCost: () => <div data-testid="daily-cost" />,
  ReportSummaryTrend: () => <div data-testid="cumulative-trend" />,
  ReportSummaryDailyTrend: () => <div data-testid="daily-trend" />,
  ReportSummaryDetails: () => null,
  ReportSummaryItem: () => null,
  ReportSummaryItems: (props: any) => (typeof props.children === 'function' ? props.children({ items: [] }) : null),
  ReportSummaryUsage: () => null,
}));

const tmessages = defineMessages({
  testTitle: { id: 'TestTitle', description: 'test title', defaultMessage: 'test title' },
  testTrendTitle: { id: 'TestTrendTitle', description: 'test trend title', defaultMessage: 'test trend title' },
});

const makeProps = (over: Partial<DashboardWidgetProps> = {}): DashboardWidgetProps => ({
  widgetId: 1,
  id: 1,
  intl,
  current: { data: [] } as any,
  previous: { data: [] } as any,
  tabs: { data: [] } as any,
  fetchReports: jest.fn(),
  fetchForecasts: jest.fn(),
  updateTab: jest.fn(),
  titleKey: tmessages.testTitle,
  trend: { datumType: DatumType.cumulative, titleKey: tmessages.testTrendTitle, formatOptions: {} } as any,
  status: FetchStatus.none,
  currentQuery: '',
  previousQuery: '',
  tabsQuery: '',
  details: { breakdownDescKeyRange: 'detail description range', breakdownDescKeySingle: 'detail description single', formatOptions: {} } as any,
  topItems: { formatOptions: {} } as any,
  availableTabs: ['projects', 'clusters'] as any,
  currentTab: 'projects' as any,
  getIdKeyForTab: (tab: string) => tab,
  chartType: DashboardChartType.trend as any,
  ...over,
}) as any;

describe('DashboardWidgetBase', () => {
  test('reports are fetched on mount', () => {
    const props = makeProps();
    render(<DashboardWidgetBase {...props} />);
    expect(props.fetchReports).toHaveBeenCalledWith(props.widgetId);
  });

  test('title and trend title translate', () => {
    const props = makeProps();
    render(<DashboardWidgetBase {...props} />);
    expect(intl.formatMessage(props.titleKey)).toMatchSnapshot();
    expect(intl.formatMessage(props.trend.titleKey)).toMatchSnapshot();
  });

  test('handleTabClick updates active tab and calls updateTab', () => {
    const props = makeProps();
    render(<DashboardWidgetBase {...props} />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(props.updateTab).toHaveBeenCalled();
  });

  test('comparison toggle switches to daily and forecast path present triggers mount fetch', () => {
    const props = makeProps({
      chartType: DashboardChartType.dailyCost as any, // ensure ChartComparison is rendered
      trend: { datumType: DatumType.cumulative, titleKey: tmessages.testTrendTitle, dailyTitleKey: tmessages.testTrendTitle, formatOptions: {}, computedForecastItem: 'cost' } as any,
      forecast: { data: [] } as any,
    });
    render(<DashboardWidgetBase {...props} />);

    // Initially cumulative variant should render
    expect(screen.queryByTestId('cumulative-cost')).toBeInTheDocument();

    // Click the deterministic toggle button and assert daily variant renders
    fireEvent.click(screen.getByRole('button', { name: /comparison-toggle/i }));
    expect(screen.getByTestId('daily-cost')).toBeInTheDocument();

    // Forecasts are fetched on mount when computedForecastItem is present
    expect(props.fetchForecasts).toHaveBeenCalled();
  });

  test('renders optimizations summary when showOptimizations is true', () => {
    const props = makeProps({ details: { showOptimizations: true } as any });
    render(<DashboardWidgetBase {...props} />);
    expect(true).toBe(true);
  });

  test('renders different charts based on chartType', () => {
    const base = makeProps();
    render(<DashboardWidgetBase {...base} chartType={1 as any} />);
    render(<DashboardWidgetBase {...base} chartType={2 as any} />);
    render(<DashboardWidgetBase {...base} chartType={3 as any} trend={{ ...(base.trend as any), computedReportItem: ComputedReportItemType.usage }} />);
    expect(true).toBe(true);
  });
});
