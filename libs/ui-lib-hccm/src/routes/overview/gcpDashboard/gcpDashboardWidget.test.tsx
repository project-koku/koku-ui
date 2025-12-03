import { render } from '@testing-library/react';
import React from 'react';
import { GcpDashboardWidget, getIdKeyForTab } from './gcpDashboardWidget';
import { GcpDashboardTab } from '../../../store/dashboard/gcpDashboard';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));
jest.mock('react-intl', () => ({ __esModule: true, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => '' }} /> }));

jest.mock('store/dashboard/gcpDashboard', () => ({
  __esModule: true,
  GcpDashboardTab: { gcpProjects: 'gcpProjects', regions: 'regions', services: 'services' },
  gcpDashboardSelectors: {
    selectWidget: () => ({ widgetId: 1 }),
    selectWidgetQueries: () => ({ current: {}, previous: {}, tabs: {}, forecast: {} }),
  },
  gcpDashboardActions: {
    changeWidgetTab: jest.fn(),
    fetchWidgetForecasts: jest.fn(),
    fetchWidgetReports: jest.fn(),
  },
}));

jest.mock('store/reports', () => ({ __esModule: true, reportSelectors: { selectReport: jest.fn(), selectReportError: jest.fn(), selectReportFetchStatus: jest.fn() } }));
jest.mock('store/forecasts', () => ({ __esModule: true, forecastSelectors: { selectForecast: jest.fn(), selectForecastError: jest.fn(), selectForecastFetchStatus: jest.fn() } }));

jest.mock('utils/sessionStorage', () => ({ __esModule: true, getCurrency: () => 'USD' }));

jest.mock('routes/overview/components', () => ({ __esModule: true, DashboardWidgetBase: (props: any) => <div data-testid="widget" data-currency={props.currency} /> }));

describe('gcpDashboardWidget connector', () => {
  test.each([
    [GcpDashboardTab.gcpProjects, 'gcp_project'],
    [GcpDashboardTab.regions, 'region'],
    [GcpDashboardTab.services, 'service'],
  ])('getIdKeyForTab %#', (tab, expected) => {
    expect(getIdKeyForTab(tab as any)).toBe(expected);
  });

  test('maps currency into base widget', () => {
    const { getByTestId } = render(<GcpDashboardWidget widgetId={1} /> as any);
    const el = getByTestId('widget');
    expect(el.getAttribute('data-currency')).toBe('USD');
  });
});
