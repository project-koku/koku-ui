import { render } from '@testing-library/react';
import React from 'react';
import { AwsOcpDashboardWidget, getIdKeyForTab } from './awsOcpDashboardWidget';
import { AwsOcpDashboardTab } from '../../../store/dashboard/awsOcpDashboard';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));

jest.mock('react-intl', () => ({
  __esModule: true,
  injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => '' }} />,
}));

jest.mock('store/dashboard/awsOcpDashboard', () => ({
  __esModule: true,
  AwsOcpDashboardTab: { services: 'services', accounts: 'accounts', regions: 'regions' },
  awsOcpDashboardSelectors: {
      selectWidget: () => ({ widgetId: 1 }),
      selectWidgetQueries: () => ({ current: {}, previous: {}, tabs: {}, forecast: {} }),
  },
  awsOcpDashboardActions: {
    changeWidgetTab: jest.fn(),
    fetchWidgetForecasts: jest.fn(),
    fetchWidgetReports: jest.fn(),
  },
}));

jest.mock('store/reports', () => ({ __esModule: true, reportSelectors: { selectReport: jest.fn(), selectReportError: jest.fn(), selectReportFetchStatus: jest.fn() } }));
jest.mock('store/forecasts', () => ({ __esModule: true, forecastSelectors: { selectForecast: jest.fn(), selectForecastError: jest.fn(), selectForecastFetchStatus: jest.fn() } }));

jest.mock('utils/sessionStorage', () => ({ __esModule: true, getCurrency: () => 'USD', getCostType: () => 'blended' }));

jest.mock('routes/overview/components', () => ({
  __esModule: true,
  DashboardWidgetBase: (props: any) => <div data-testid="widget" data-currency={props.currency} data-costtype={props.costType} />,
}));

describe('awsOcpDashboardWidget connector', () => {
  test.each([
    [AwsOcpDashboardTab.services, 'service'],
    [AwsOcpDashboardTab.accounts, 'account'],
    [AwsOcpDashboardTab.regions, 'region'],
  ])('getIdKeyForTab %#', (tab, expected) => {
    expect(getIdKeyForTab(tab as any)).toBe(expected);
  });

  test('maps currency and costType into base widget', () => {
    const { getByTestId } = render(<AwsOcpDashboardWidget widgetId={1} /> as any);
    const el = getByTestId('widget');
    expect(el.getAttribute('data-currency')).toBe('USD');
    expect(el.getAttribute('data-costtype')).toBe('blended');
  });
}); 