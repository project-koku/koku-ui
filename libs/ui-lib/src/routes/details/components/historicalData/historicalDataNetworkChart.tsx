import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Report, ReportPathsType } from '@koku-ui/api/reports/report';
import { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Skeleton } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../../../store/common';
import { reportActions, reportSelectors } from '../../../../store/reports';
import { formatUnits, unitsLookupKey } from '../../../../utils/format';
import { logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { DatumType, transformReport } from '../../../components/charts/common/chartDatum';
import { HistoricalUsageChart } from '../../../components/charts/historicalUsageChart';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../utils/groupBy';
import { getQueryState } from '../../../utils/queryState';
import { skeletonWidth } from '../../../utils/skeleton';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataNetworkChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  chartName?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  showLimit?: boolean;
  showRequest?: boolean;
  timeScopeValue?: number;
}

interface HistoricalDataNetworkChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataNetworkChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataNetworkChartProps = HistoricalDataNetworkChartOwnProps &
  HistoricalDataNetworkChartStateProps &
  HistoricalDataNetworkChartDispatchProps;

class HistoricalDataNetworkChartBase extends React.Component<HistoricalDataNetworkChartProps, any> {
  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: HistoricalDataNetworkChartProps) {
    const { currentQueryString, previousQueryString } = this.props;

    if (prevProps.currentQueryString !== currentQueryString || prevProps.previousQueryString !== previousQueryString) {
      this.updateReport();
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  private updateReport = () => {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;
    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  };

  public render() {
    const {
      chartName,
      currentReport,
      currentReportFetchStatus,
      previousReport,
      previousReportFetchStatus,
      intl,
      showLimit,
      showRequest,
    } = this.props;

    // Current data
    const currentRequestData = transformReport(currentReport, DatumType.rolling, 'date', 'data_transfer_in', undefined);
    const currentUsageData = transformReport(currentReport, DatumType.rolling, 'date', 'data_transfer_out', undefined);

    // Previous data
    const previousRequestData = transformReport(
      previousReport,
      DatumType.rolling,
      'date',
      'data_transfer_in',
      undefined
    );
    const previousUsageData = transformReport(
      previousReport,
      DatumType.rolling,
      'date',
      'data_transfer_out',
      undefined
    );

    const usageUnits = currentReport?.meta?.total?.usage ? currentReport.meta.total.usage.units : '';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.usageChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalUsageChart
              baseHeight={chartStyles.chartHeight}
              currentRequestData={currentRequestData}
              currentUsageData={currentUsageData}
              formatter={formatUnits}
              formatOptions={{}}
              name={chartName}
              previousRequestData={previousRequestData}
              previousUsageData={previousUsageData}
              requestLabelKey={messages.chartDataInLabel}
              requestLabelNoDataKey={messages.chartDataInLabelNoData}
              requestTooltipKey={messages.chartDataInTooltip}
              showLimit={showLimit}
              showRequest={showRequest}
              usageLabelKey={messages.chartDataOutLabel}
              usageLabelNoDataKey={messages.chartDataOutLabelNoData}
              usageTooltipKey={messages.chartDataOutTooltip}
              xAxisLabel={intl.formatMessage(messages.historicalChartDayOfMonthLabel)}
              yAxisLabel={intl.formatMessage(messages.units, { units: unitsLookupKey(usageUnits) })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataNetworkChartOwnProps, HistoricalDataNetworkChartStateProps>(
  (state, { reportPathsType, reportType, router, timeScopeValue = -1 }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';

    // instance-types and storage APIs must filter org units
    const useFilter = reportType === ReportType.instanceType || reportType === ReportType.storage;

    // Todo: group_by storage_class?
    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        ...(groupByOrgValue && useFilter && { [orgUnitIdKey]: groupByOrgValue }),
        // Workaround for https://issues.redhat.com/browse/COST-1189
        ...(queryState?.filter_by &&
          queryState.filter_by[orgUnitIdKey] && {
            [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
            [orgUnitIdKey]: undefined,
          }),
      },
      exclude: {
        ...(queryState?.exclude && queryState.exclude),
      },
      group_by: {
        ...(groupByOrgValue && !useFilter && { [orgUnitIdKey]: groupByOrgValue }),
        ...(groupBy && !groupByOrgValue && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
      },
    };

    // Current report
    const currentQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue,
      },
      filter_by: {
        ...baseQuery.filter_by,
        // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(isFilterByExact && {
          [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
          [`exact:${groupBy}`]: groupByValue,
        }),
      },
    };

    const currentQueryString = getQuery(currentQuery);
    const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
    const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      currentQueryString
    );

    // Previous report
    const previousQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue - 1,
      },
      filter_by: {
        ...baseQuery.filter_by,
        // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(isFilterByExact && {
          [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
          [`exact:${groupBy}`]: groupByValue,
        }),
      },
    };

    const previousQueryString = getQuery(previousQuery);
    const previousReport = reportSelectors.selectReport(state, reportPathsType, reportType, previousQueryString);
    const previousReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      previousQueryString
    );

    return {
      currentQuery,
      currentQueryString,
      currentReport,
      currentReportFetchStatus,
      previousQuery,
      previousQueryString,
      previousReport,
      previousReportFetchStatus,
    };
  }
);

const mapDispatchToProps: HistoricalDataNetworkChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataNetworkChart = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataNetworkChartBase))
);

export { HistoricalDataNetworkChart };
