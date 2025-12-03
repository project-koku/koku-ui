import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import {
  awsOcpDashboardActions,
  awsOcpDashboardSelectors,
  AwsOcpDashboardTab,
} from '../../../store/dashboard/awsOcpDashboard';
import { forecastSelectors } from '../../../store/forecasts';
import { reportSelectors } from '../../../store/reports';
import { getCostType, getCurrency } from '../../../utils/sessionStorage';
import type { ComputedAwsReportItemsParams } from '../../utils/computedReport/getComputedAwsReportItems';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from '../components';
import { DashboardWidgetBase } from '../components';

interface AwsOcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof awsOcpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof awsOcpDashboardActions.fetchWidgetReports;
  updateTab: typeof awsOcpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AwsOcpDashboardTab): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsOcpDashboardTab.services:
      return 'service';
    case AwsOcpDashboardTab.accounts:
      return 'account';
    case AwsOcpDashboardTab.regions:
      return 'region';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = awsOcpDashboardSelectors.selectWidget(state, widgetId);
    const queries = awsOcpDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      currency: getCurrency(),
      costType: getCostType(),
      getIdKeyForTab,
      ...(widget.forecastPathsType &&
        widget.forecastType && {
          forecast: forecastSelectors.selectForecast(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
          forecastError: forecastSelectors.selectForecastError(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
          forecastFetchStatus: forecastSelectors.selectForecastFetchStatus(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
        }),
      ...(widget.reportPathsType &&
        widget.reportType && {
          currentReport: reportSelectors.selectReport(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          currentReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          currentReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          previousReport: reportSelectors.selectReport(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          previousReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          previousReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          tabsReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.tabs),
          tabsReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.tabs
          ),
          tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.tabs
          ),
        }),
    };
  }
);

const mapDispatchToProps: AwsOcpDashboardWidgetDispatchProps = {
  fetchForecasts: awsOcpDashboardActions.fetchWidgetForecasts,
  fetchReports: awsOcpDashboardActions.fetchWidgetReports,
  updateTab: awsOcpDashboardActions.changeWidgetTab,
};

const AwsOcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AwsOcpDashboardWidget };
