import { render } from '@testing-library/react';
import React from 'react';
import { intl } from '@koku-ui/i18n/i18n';
import type { DashboardWidgetProps } from './dashboardWidgetBase';
import { DatumType } from '../../components/charts/common/chartDatum';
import { DashboardChartType } from '../../../store/dashboard/common/dashboardCommon';
import { mockPatternFlyTabs, mockReportSummaries, mockRouterLink } from '../../../../test/utils/mocks.extra';
import { MemoryRouter } from 'react-router-dom';

// Mock scalprum AsyncComponent usage
jest.mock('../../../init', () => ({
  __esModule: true,
  AsyncComponent: () => null }
));

// Apply shared mocks BEFORE importing component under test
mockPatternFlyTabs();
mockRouterLink();
const { captured } = mockReportSummaries();

// Defer importing component until after mocks are registered
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DashboardWidgetBase } = require('routes/overview/components');

// Shared router wrapper to eliminate MemoryRouter duplication
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    } as any}
  >
    {children}
  </MemoryRouter>
);

const renderWithRouter = (ui: React.ReactElement) => render(ui, { wrapper: RouterWrapper });

const makeProps = (over: Partial<DashboardWidgetProps> = {}): DashboardWidgetProps => ({
  widgetId: 1,
  id: 1,
  intl,
  currentReport: { data: [], meta: { total: { cost: { total: { units: 'USD' } }, usage: { units: 'GB' } } } } as any,
  previousReport: { data: [] } as any,
  tabsReport: { data: [], meta: {} } as any,
  fetchReports: jest.fn(),
  fetchForecasts: jest.fn(),
  updateTab: jest.fn(),
  titleKey: { id: 't', defaultMessage: 't' } as any,
  trend: { datumType: DatumType.cumulative, titleKey: { id: 'tt', defaultMessage: 'tt' }, formatOptions: {} } as any,
  details: { showHorizontal: false, showUsageLegendLabel: false, showOptimizations: false } as any,
  availableTabs: ['projects', 'clusters'] as any,
  currentTab: 'projects' as any,
  getIdKeyForTab: (tab: string) => tab,
  chartType: DashboardChartType.trend as any,
  reportType: 'cost' as any,
  ...over,
});

describe('DashboardWidgetBase extra', () => {
  beforeEach(() => {
    captured.length = 0;
    jest.clearAllMocks();
  });

  test('mount triggers updateTab with first tab and fetchReports', () => {
    const props = makeProps();
    renderWithRouter(<DashboardWidgetBase {...props} />);
    expect(props.updateTab).toHaveBeenCalledWith(props.id, props.availableTabs[0]);
    expect(props.fetchReports).toHaveBeenCalledWith(props.widgetId);
  });

  test('componentDidUpdate triggers updates on costType change with forecast available', () => {
    const props = makeProps({ trend: { ...(makeProps().trend as any), computedForecastItem: 'cost' } as any });
    const { rerender } = renderWithRouter(<DashboardWidgetBase {...props} costType="cost" />);
    rerender(<DashboardWidgetBase {...props} costType="blended" />);
    expect(props.fetchReports).toHaveBeenCalledTimes(2); // mount + update
    expect(props.fetchForecasts).toHaveBeenCalled();
  });

  test('detailsLink is rendered when viewAllPath provided', () => {
    const props = makeProps({ details: { ...(makeProps().details as any), viewAllPath: '/details' } });
    renderWithRouter(<DashboardWidgetBase {...props} />);
    const summary = captured.findLast(c => c.comp === 'ReportSummary' || c.comp === 'ReportSummaryAlt');
    expect(summary).toBeTruthy();
    const { detailsLink } = summary!.props;
    expect(detailsLink?.props?.to).toContain('group_by');
  });

  test('units resolution: details.units override', () => {
    const overrideProps = makeProps({ details: { ...(makeProps().details as any), units: 'HRS' } });
    renderWithRouter(<DashboardWidgetBase {...overrideProps} />);
    const trends = captured.filter(c => c.comp === 'ReportSummaryTrend');
    expect(trends.some(t => t.props.units === 'HRS')).toBe(true);
  });

  test('ReportSummaryItems renders within tabs content', () => {
    const props = makeProps();
    renderWithRouter(<DashboardWidgetBase {...props} />);
    const itemsContainer = captured.filter(c => c.comp === 'ReportSummaryItems');
    expect(itemsContainer.length).toBeGreaterThan(0);
  });
});
