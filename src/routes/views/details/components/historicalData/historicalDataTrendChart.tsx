import { Skeleton } from '@patternfly/react-core';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { ChartType, transformReport } from 'routes/views/components/charts/common/chartDatumUtils';
import { HistoricalTrendChart } from 'routes/views/components/charts/historicalTrendChart';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatUnits, unitsLookupKey } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataTrendChartOwnProps {
  costType?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataTrendChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataTrendChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataTrendChartProps = HistoricalDataTrendChartOwnProps &
  HistoricalDataTrendChartStateProps &
  HistoricalDataTrendChartDispatchProps &
  WrappedComponentProps;

class HistoricalDataTrendChartBase extends React.Component<HistoricalDataTrendChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataTrendChartProps) {
    const { fetchReport, costType, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    if (prevProps.currentQueryString !== currentQueryString || prevProps.costType !== costType) {
      fetchReport(reportPathsType, reportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString || prevProps.costType !== costType) {
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
    const { currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, reportType, intl } =
      this.props;

    const isCostChart = reportType === ReportType.cost;

    // Current data
    const currentData = transformReport(
      currentReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );
    const previousData = transformReport(
      previousReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );

    const costUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.cost
        ? currentReport.meta.total.cost.total.units
        : 'USD';

    const usageUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.usage
        ? currentReport.meta.total.usage.units
        : undefined;

    let yAxisLabel;
    if (isCostChart) {
      const units = intl.formatMessage(messages.currencyUnits, { units: costUnits });
      yAxisLabel = intl.formatMessage(messages.historicalChartCostLabel, { units });
    } else if (usageUnits && Number.isNaN(Number(currentReport.meta.total.usage.units))) {
      yAxisLabel = intl.formatMessage(messages.units, { units: unitsLookupKey(usageUnits) });
    } else {
      const units = intl.formatMessage(messages.historicalChartUsageLabel, { value: reportType });
      yAxisLabel = intl.formatMessage(messages.units, { units: unitsLookupKey(units) });
    }

    return (
      <div style={styles.chartContainer}>
        <div style={styles.trendChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight - 50}
              currentData={currentData}
              formatOptions={{}}
              formatter={formatUnits}
              height={chartStyles.chartHeight}
              previousData={previousData}
              units={isCostChart ? costUnits : usageUnits}
              xAxisLabel={intl.formatMessage(messages.historicalChartDayOfMonthLabel)}
              yAxisLabel={yAxisLabel}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataTrendChartOwnProps, HistoricalDataTrendChartStateProps>(
  (state, { costType, reportPathsType, reportType }) => {
    const query = parseQuery<Query>(location.search);
    const groupByOrgValue = getGroupByOrgValue(query);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

    const baseQuery: Query = {
      cost_type: costType,
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
      },
      group_by: {
        ...(groupBy && { [groupBy]: groupByValue }),
      },
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

const mapDispatchToProps: HistoricalDataTrendChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataTrendChart = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataTrendChartBase));

export { HistoricalDataTrendChart, HistoricalDataTrendChartProps };
