import { Skeleton, Title } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import {
  ChartType,
  ComputedReportItemType,
  ComputedReportItemValueType,
  transformReport,
} from 'routes/views/components/charts/common/chartDatumUtils';
import { TrendChart } from 'routes/views/components/charts/trendChart';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { unitsLookupKey } from 'utils/format';
import { formatUnits } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './ocpOverviewChart.styles';

interface OcpOverviewChartOwnProps {
  chartName: string;
  computedReportItemType?: ComputedReportItemType;
  title?: string; // This is just a test property
}

interface OcpOverviewChartStateProps {
  currentQuery: Query;
  currentQueryString: string;
  currentReport: Report;
  currentReportError: AxiosError;
  currentReportFetchStatus: FetchStatus;
  previousQuery: Query;
  previousQueryString: string;
  previousReport: Report;
  previousReportError: AxiosError;
  previousReportFetchStatus: FetchStatus;
}

interface OcpOverviewChartDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface OcpOverviewChartState {
  // TBD...
}

type OcpOverviewChartProps = OcpOverviewChartStateProps & OcpOverviewChartOwnProps & OcpOverviewChartDispatchProps;

const computedReportItem = ComputedReportItemType.cost; // cost, supplementary cost, etc.
const computedReportItemValue = ComputedReportItemValueType.total; // infrastructure usage cost
const reportPathsType = ReportPathsType.ocp;
const reportType = ReportType.cost;

class OcpOverviewChartBase extends React.Component<OcpOverviewChartProps> {
  protected defaultState: OcpOverviewChartState = {};
  public state: OcpOverviewChartState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OcpOverviewChartProps) {
    const {
      currentReport,
      currentReportError,
      currentQueryString,
      previousReport,
      previousReportError,
      previousQueryString,
    } = this.props;

    const newQuery =
      prevProps.currentQueryString !== currentQueryString || prevProps.previousQueryString !== previousQueryString;
    const noReport = !(currentReport || previousReport) && !(currentReportError || previousReportError);

    if (newQuery || noReport) {
      this.updateReport();
    }
  }

  private getChart = () => {
    const { chartName, currentReport, previousReport } = this.props;
    const units = this.getUnits();

    const currentData = transformReport(
      currentReport,
      ChartType.rolling,
      'date',
      computedReportItem,
      computedReportItemValue
    );
    const previousData = transformReport(
      previousReport,
      ChartType.rolling,
      'date',
      computedReportItem,
      computedReportItemValue
    );

    return (
      <TrendChart
        adjustContainerHeight
        chartName={chartName}
        containerHeight={chartStyles.chartContainerHeight}
        currentData={currentData}
        formatter={formatUnits}
        height={chartStyles.chartHeight}
        previousData={previousData}
        units={units}
      />
    );
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  private getUnits = () => {
    const { currentReport } = this.props;

    const hasTotal = currentReport && currentReport.meta && currentReport.meta.total;
    const hasCost =
      hasTotal &&
      currentReport.meta.total[computedReportItem] &&
      currentReport.meta.total[computedReportItem][computedReportItemValue];

    return hasCost ? unitsLookupKey(currentReport.meta.total[computedReportItem][computedReportItemValue].units) : '';
  };

  private updateReport = () => {
    const { currentQueryString, fetchReport, previousQueryString } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  };

  public render() {
    const { currentReportFetchStatus, previousReportFetchStatus, title } = this.props;

    return (
      <>
        <div style={styles.titleContainer}>
          <Title headingLevel="h3" size="md">
            {title}
          </Title>
        </div>
        <div style={styles.chartContainer}>
          <div style={styles.costChart}>
            {currentReportFetchStatus === FetchStatus.inProgress || previousReportFetchStatus === FetchStatus.inProgress
              ? this.getSkeleton()
              : this.getChart()}
          </div>
        </div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpOverviewChartOwnProps, OcpOverviewChartStateProps>((state, props) => {
  const currentQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'daily',
    },
  };
  const previousQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -2,
      resolution: 'daily',
    },
  };
  const currentQueryString = getQuery(currentQuery);
  const previousQueryString = getQuery(previousQuery);

  const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
  const currentReportError = reportSelectors.selectReportError(state, reportPathsType, reportType, currentQueryString);
  const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    currentQueryString
  );

  const previousReport = reportSelectors.selectReport(state, reportPathsType, reportType, previousQueryString);
  const previousReportError = reportSelectors.selectReportError(
    state,
    reportPathsType,
    reportType,
    previousQueryString
  );
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
    currentReportError,
    currentReportFetchStatus,
    previousQuery,
    previousQueryString,
    previousReport,
    previousReportError,
    previousReportFetchStatus,
  };
});

const mapDispatchToProps: OcpOverviewChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default connect(mapStateToProps, mapDispatchToProps)(OcpOverviewChartBase);
