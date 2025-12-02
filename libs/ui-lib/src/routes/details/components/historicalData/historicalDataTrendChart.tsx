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
import { HistoricalTrendChart } from '../../../components/charts/historicalTrendChart';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from '../../../utils/groupBy';
import { getQueryState } from '../../../utils/queryState';
import { skeletonWidth } from '../../../utils/skeleton';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataTrendChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  chartName?: string;
  costType?: string;
  currency?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  timeScopeValue?: number;
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
  HistoricalDataTrendChartDispatchProps;

class HistoricalDataTrendChartBase extends React.Component<HistoricalDataTrendChartProps, any> {
  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: HistoricalDataTrendChartProps) {
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
      currentReport,
      currentReportFetchStatus,
      previousReport,
      previousReportFetchStatus,
      reportType,
      intl,
    } = this.props;

    const isCostChart = reportType === ReportType.cost;

    // Current data
    const currentData = transformReport(
      currentReport,
      isCostChart ? DatumType.cumulative : DatumType.rolling,
      'date',
      isCostChart ? 'cost' : 'usage',
      'total'
    );
    const previousData = transformReport(
      previousReport,
      isCostChart ? DatumType.cumulative : DatumType.rolling,
      'date',
      isCostChart ? 'cost' : 'usage',
      'total'
    );

    const costUnits = currentReport?.meta?.total?.cost?.total ? currentReport.meta.total.cost.total.units : 'USD';

    const usageUnits = currentReport?.meta?.total?.usage ? currentReport.meta.total.usage.units : undefined;

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
              baseHeight={chartStyles.chartHeight}
              currentData={currentData}
              formatOptions={{}}
              formatter={formatUnits}
              name={chartName}
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
  (state, { costType, currency, reportPathsType, reportType, router, timeScopeValue = -1 }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
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

const mapDispatchToProps: HistoricalDataTrendChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataTrendChart = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataTrendChartBase))
);

export { HistoricalDataTrendChart };
