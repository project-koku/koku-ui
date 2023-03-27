import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  transformReport,
} from 'components/charts/common/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
  currentCostReport?: AwsReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentInstanceReport?: AwsReport;
  currentInstanceReportFetchStatus?: FetchStatus;
  currentStorageReport?: AwsReport;
  currentStorageReportFetchStatus?: FetchStatus;
  previousCostReport?: AwsReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousInstanceReport?: AwsReport;
  previousInstanceReportFetchStatus?: FetchStatus;
  previousStorageReport?: AwsReport;
  previousStorageReportFetchStatus?: FetchStatus;
}

interface HistoricalModalDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const costReportType = ReportType.cost;
const instanceReportType = ReportType.instanceType;
const storageReportType = ReportType.storage;
const reportPathsType = ReportPathsType.aws;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    fetchReport(reportPathsType, costReportType, currentQueryString);
    fetchReport(reportPathsType, instanceReportType, currentQueryString);
    fetchReport(reportPathsType, storageReportType, currentQueryString);
    fetchReport(reportPathsType, costReportType, previousQueryString);
    fetchReport(reportPathsType, instanceReportType, previousQueryString);
    fetchReport(reportPathsType, storageReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;
    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(reportPathsType, costReportType, currentQueryString);
      fetchReport(reportPathsType, instanceReportType, currentQueryString);
      fetchReport(reportPathsType, storageReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(reportPathsType, costReportType, previousQueryString);
      fetchReport(reportPathsType, instanceReportType, previousQueryString);
      this.props.fetchReport(
        reportPathsType,
        storageReportType,
        previousQueryString
      );
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} size={SkeletonSize.md} />
        <Skeleton style={styles.legendSkeleton} size={SkeletonSize.xs} />
      </>
    );
  };

  public render() {
    const {
      currentCostReport,
      currentCostReportFetchStatus,
      currentInstanceReport,
      currentInstanceReportFetchStatus,
      currentStorageReport,
      currentStorageReportFetchStatus,
      previousCostReport,
      previousCostReportFetchStatus,
      previousInstanceReport,
      previousInstanceReportFetchStatus,
      previousStorageReport,
      previousStorageReportFetchStatus,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousCostData = transformReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );

    // Instance data
    const currentInstanceData = transformReport(
      currentInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousInstanceData = transformReport(
      previousInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );

    // Storage data
    const currentStorageData = transformReport(
      currentStorageReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousStorageData = transformReport(
      previousStorageReport,
      ChartType.daily,
      'date',
      'cost'
    );

    const costUnits =
      currentCostReport &&
      currentCostReport.meta &&
      currentCostReport.meta.total &&
      currentCostReport.meta.total.cost
        ? currentCostReport.meta.total.cost.total.units
        : 'USD';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentCostReportFetchStatus === FetchStatus.inProgress &&
          previousCostReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentCostData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousCostData}
              title={t('aws_details.historical.cost_title')}
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div style={styles.instanceChart}>
          {currentInstanceReportFetchStatus === FetchStatus.inProgress &&
          previousInstanceReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentInstanceData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousInstanceData}
              title={t('aws_details.historical.instance_title')}
              showUsageLegendLabel
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.instance_label')}
            />
          )}
        </div>
        <div style={styles.storageChart}>
          {currentStorageReportFetchStatus === FetchStatus.inProgress &&
          previousStorageReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentStorageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousStorageData}
              title={t('aws_details.historical.storage_title')}
              showUsageLegendLabel
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.storage_label')}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalModalOwnProps,
  HistoricalModalStateProps
>((state, { currentQueryString, previousQueryString }) => {
  // Current report
  const currentCostReport = reportSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentInstanceReport = reportSelectors.selectReport(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentInstanceReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentStorageReport = reportSelectors.selectReport(
    state,
    storageReportType,
    currentQueryString
  );
  const currentStorageReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    storageReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = reportSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousInstanceReport = reportSelectors.selectReport(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousInstanceReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousStorageReport = reportSelectors.selectReport(
    state,
    storageReportType,
    previousQueryString
  );
  const previousStorageReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    storageReportType,
    previousQueryString
  );
  return {
    currentCostReport,
    currentCostReportFetchStatus,
    currentInstanceReport,
    currentInstanceReportFetchStatus,
    currentStorageReport,
    currentStorageReportFetchStatus,
    previousCostReport,
    previousCostReportFetchStatus,
    previousInstanceReport,
    previousInstanceReportFetchStatus,
    previousStorageReport,
    previousStorageReportFetchStatus,
  };
});

const mapDispatchToProps: HistoricalModalDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
