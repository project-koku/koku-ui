import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Skeleton } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../../../store/common';
import { reportActions, reportSelectors } from '../../../../store/reports';
import { formatUnits } from '../../../../utils/format';
import { logicalOrPrefix, orgUnitIdKey, platformCategoryKey } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { ComputedReportItemValueType, DatumType, transformReport } from '../../../components/charts/common/chartDatum';
import { HistoricalCostChart } from '../../../components/charts/historicalCostChart';
import { getGroupById, getGroupByValue } from '../../../utils/groupBy';
import { getQueryState } from '../../../utils/queryState';
import { skeletonWidth } from '../../../utils/skeleton';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataCostChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  chartName?: string;
  costDistribution: string;
  costType?: string;
  currency?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  timeScopeValue?: number;
}

interface HistoricalDataCostChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataCostChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataCostChartProps = HistoricalDataCostChartOwnProps &
  HistoricalDataCostChartStateProps &
  HistoricalDataCostChartDispatchProps;

class HistoricalDataCostChartBase extends React.Component<HistoricalDataCostChartProps, any> {
  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: HistoricalDataCostChartProps) {
    const { costType, currency, currentQueryString, previousQueryString } = this.props;

    if (
      prevProps.currentQueryString !== currentQueryString ||
      prevProps.previousQueryString !== previousQueryString ||
      prevProps.costType !== costType ||
      prevProps.currency !== currency
    ) {
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
      costDistribution,
      currentReport,
      currentReportFetchStatus,
      previousReport,
      previousReportFetchStatus,
      intl,
    } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;

    // Current data
    const currentData = transformReport(currentReport, DatumType.cumulative, 'date', 'cost', reportItemValue);
    const currentInfrastructureCostData = transformReport(
      currentReport,
      DatumType.cumulative,
      'date',
      'infrastructure',
      'total'
    );

    // Previous data
    const previousData = transformReport(previousReport, DatumType.cumulative, 'date', 'cost', reportItemValue);
    const previousInfrastructureCostData = transformReport(
      previousReport,
      DatumType.cumulative,
      'date',
      'infrastructure',
      'total'
    );

    const costUnits = currentReport?.meta?.total?.cost ? currentReport.meta.total.cost[reportItemValue].units : 'USD';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalCostChart
              baseHeight={chartStyles.chartHeight}
              currentCostData={currentData}
              currentInfrastructureCostData={currentInfrastructureCostData}
              formatOptions={{}}
              formatter={formatUnits}
              name={chartName}
              previousCostData={previousData}
              previousInfrastructureCostData={previousInfrastructureCostData}
              xAxisLabel={intl.formatMessage(messages.historicalChartDayOfMonthLabel)}
              yAxisLabel={intl.formatMessage(messages.historicalChartCostLabel, {
                units: intl.formatMessage(messages.currencyUnits, { units: costUnits }) as string,
              })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataCostChartOwnProps, HistoricalDataCostChartStateProps>(
  (state, { costType, currency, reportPathsType, reportType, router, timeScopeValue = -1 }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
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
        ...(groupBy && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
      },
    };

    // Current report
    const currentQuery: Query = {
      ...baseQuery,
      cost_type: costType,
      currency,
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
      cost_type: costType,
      currency,
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

const mapDispatchToProps: HistoricalDataCostChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataCostChart = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataCostChartBase))
);

export { HistoricalDataCostChart };
