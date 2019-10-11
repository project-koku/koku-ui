import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { AzureReport, AzureReportType } from 'api/azureReports';
import {
  ChartType,
  transformAzureReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as azureReportsActions from 'store/azureReports/azureReportsActions';
import * as azureReportsSelectors from 'store/azureReports/azureReportsSelectors';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
  currentCostReport?: AzureReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentInstanceReport?: AzureReport;
  currentInstanceReportFetchStatus?: FetchStatus;
  currentStorageReport?: AzureReport;
  currentStorageReportFetchStatus?: FetchStatus;
  previousCostReport?: AzureReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousInstanceReport?: AzureReport;
  previousInstanceReportFetchStatus?: FetchStatus;
  previousStorageReport?: AzureReport;
  previousStorageReportFetchStatus?: FetchStatus;
}

interface HistoricalModalDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const costReportType = AzureReportType.cost;
const instanceReportType = AzureReportType.instanceType;
const storageReportType = AzureReportType.storage;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    fetchReport(costReportType, currentQueryString);
    fetchReport(instanceReportType, currentQueryString);
    fetchReport(storageReportType, currentQueryString);
    fetchReport(costReportType, previousQueryString);
    fetchReport(instanceReportType, previousQueryString);
    fetchReport(storageReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;
    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(costReportType, currentQueryString);
      fetchReport(instanceReportType, currentQueryString);
      fetchReport(storageReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(costReportType, previousQueryString);
      fetchReport(instanceReportType, previousQueryString);
      this.props.fetchReport(storageReportType, previousQueryString);
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton
          className={css(styles.chartSkeleton)}
          size={SkeletonSize.md}
        />
        <Skeleton
          className={css(styles.legendSkeleton)}
          size={SkeletonSize.xs}
        />
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
    const currentCostData = transformAzureReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousCostData = transformAzureReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );

    // Instance data
    const currentInstanceData = transformAzureReport(
      currentInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousInstanceData = transformAzureReport(
      previousInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );

    // Storage data
    const currentStorageData = transformAzureReport(
      currentStorageReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousStorageData = transformAzureReport(
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
        ? currentCostReport.meta.total.cost.units
        : 'USD';

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
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
              title={t('azure_details.historical.cost_title')}
              xAxisLabel={t('azure_details.historical.day_of_month_label')}
              yAxisLabel={t('azure_details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div className={css(styles.instanceChart)}>
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
              title={t('azure_details.historical.instance_title')}
              xAxisLabel={t('azure_details.historical.day_of_month_label')}
              yAxisLabel={t('azure_details.historical.instance_label')}
            />
          )}
        </div>
        <div className={css(styles.storageChart)}>
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
              title={t('azure_details.historical.storage_title')}
              xAxisLabel={t('azure_details.historical.day_of_month_label')}
              yAxisLabel={t('azure_details.historical.storage_label')}
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
  const currentCostReport = azureReportsSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentInstanceReport = azureReportsSelectors.selectReport(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentInstanceReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentStorageReport = azureReportsSelectors.selectReport(
    state,
    storageReportType,
    currentQueryString
  );
  const currentStorageReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    storageReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = azureReportsSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousInstanceReport = azureReportsSelectors.selectReport(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousInstanceReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousStorageReport = azureReportsSelectors.selectReport(
    state,
    storageReportType,
    previousQueryString
  );
  const previousStorageReportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
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
  fetchReport: azureReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
