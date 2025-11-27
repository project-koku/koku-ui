import { render } from '@testing-library/react';
import React from 'react';
import { OcpDashboardWidget, getIdKeyForTab } from './ocpDashboardWidget';
import { OcpDashboardTab } from '../../../store/dashboard/ocpDashboard';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));
jest.mock('react-intl', () => ({ __esModule: true, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => '' }} /> }));

jest.mock('store/dashboard/ocpDashboard', () => ({
  __esModule: true,
  OcpDashboardTab: { clusters: 'clusters', nodes: 'nodes', projects: 'projects' },
  ocpDashboardSelectors: {
    selectWidget: () => ({ widgetId: 1 }),
    selectWidgetQueries: () => ({ current: {}, previous: {}, tabs: {}, forecast: {} }),
  },
  ocpDashboardActions: {
    changeWidgetTab: jest.fn(),
    fetchWidgetForecasts: jest.fn(),
    fetchWidgetReports: jest.fn(),
  },
}));

jest.mock('store/reports', () => ({ __esModule: true, reportSelectors: { selectReport: jest.fn(), selectReportError: jest.fn(), selectReportFetchStatus: jest.fn() } }));
jest.mock('store/forecasts', () => ({ __esModule: true, forecastSelectors: { selectForecast: jest.fn(), selectForecastError: jest.fn(), selectForecastFetchStatus: jest.fn() } }));

jest.mock('utils/sessionStorage', () => ({ __esModule: true, getCurrency: () => 'USD' }));

jest.mock('./ocpDashboardWidget.styles', () => ({ __esModule: true, chartStyles: { chartAltHeight: 111, containerAltHeight: 222 } }));

jest.mock('routes/overview/components', () => ({ __esModule: true, DashboardWidgetBase: (props: any) => (
  <div data-testid="widget" data-currency={props.currency} data-alt={props.chartAltHeight + ':' + props.containerAltHeight} />
)}));

describe('ocpDashboardWidget connector', () => {
  test.each([
    [OcpDashboardTab.clusters, 'cluster'],
    [OcpDashboardTab.nodes, 'node'],
    [OcpDashboardTab.projects, 'project'],
  ])('getIdKeyForTab %#', (tab, expected) => {
    expect(getIdKeyForTab(tab as any)).toBe(expected);
  });

  test('maps currency and style heights into base widget', () => {
    const { getByTestId } = render(<OcpDashboardWidget widgetId={1} /> as any);
    const el = getByTestId('widget');
    expect(el.getAttribute('data-currency')).toBe('USD');
    expect(el.getAttribute('data-alt')).toBe('111:222');
  });
});
