import { Skeleton } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DatumType, transformReport } from 'routes/views/components/charts/common/chartDatum';
import { HistoricalCostChart } from 'routes/views/components/charts/historicalCostChart';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatUnits } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataCostChartOwnProps {
  chartName?: string;
  costType?: string;
  currency?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
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
  HistoricalDataCostChartDispatchProps &
  WrappedComponentProps;

class HistoricalDataCostChartBase extends React.Component<HistoricalDataCostChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataCostChartProps) {
    const { fetchReport, costType, currency, currentQueryString, previousQueryString, reportPathsType, reportType } =
      this.props;

    if (
      prevProps.currentQueryString !== currentQueryString ||
      prevProps.costType !== costType ||
      prevProps.currency !== currency
    ) {
      fetchReport(reportPathsType, reportType, currentQueryString);
    }
    if (
      prevProps.previousQueryString !== previousQueryString ||
      prevProps.costType !== costType ||
      prevProps.currency !== currency
    ) {
      fetchReport(reportPathsType, reportType, previousQueryString);
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

  public render() {
    const { chartName, currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, intl } =
      this.props;

    // Current data
    const currentData = transformReport(currentReport, DatumType.cumulative, 'date', 'cost');
    const currentInfrastructureCostData = transformReport(
      currentReport,
      DatumType.cumulative,
      'date',
      'infrastructure'
    );

    // Previous data
    const previousData = transformReport(previousReport, DatumType.cumulative, 'date', 'cost');
    const previousInfrastructureCostData = transformReport(
      previousReport,
      DatumType.cumulative,
      'date',
      'infrastructure'
    );

    const costUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.cost
        ? currentReport.meta.total.cost.total.units
        : 'USD';

    const test = intl.formatMessage(messages.currencyUnits, { units: costUnits });

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalCostChart
              adjustContainerHeight
              containerHeight={chartStyles.chartContainerHeight - 25}
              currentCostData={currentData}
              currentInfrastructureCostData={currentInfrastructureCostData}
              formatOptions={{}}
              formatter={formatUnits}
              height={chartStyles.chartHeight}
              name={chartName}
              previousCostData={previousData}
              previousInfrastructureCostData={previousInfrastructureCostData}
              xAxisLabel={intl.formatMessage(messages.historicalChartDayOfMonthLabel)}
              yAxisLabel={intl.formatMessage(messages.historicalChartCostLabel, {
                units: test,
              })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataCostChartOwnProps, HistoricalDataCostChartStateProps>(
  (state, { costType, currency, reportPathsType, reportType }) => {
    const query = parseQuery<Query>(location.search);
    const groupBy = getGroupById(query);
    const groupByValue = getGroupByValue(query);

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
      },
      group_by: {
        ...(groupBy && { [groupBy]: groupByValue }),
      },
      cost_type: costType,
      currency,
    };
    const currentQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };
    const currentQueryString = getQuery(currentQuery);
    const previousQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -2,
      },
    };
    const previousQueryString = getQuery(previousQuery);

    // Current report
    const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
    const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      currentQueryString
    );

    // Previous report
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

const HistoricalDataCostChart = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataCostChartBase));

export { HistoricalDataCostChart };
