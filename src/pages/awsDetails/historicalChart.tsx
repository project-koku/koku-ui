import { css } from '@patternfly/react-styles';
import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  ChartType,
  transformAwsReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as awsReportsActions from 'store/awsReports/awsReportsActions';
import * as awsReportsSelectors from 'store/awsReports/awsReportsSelectors';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  groupBy: string;
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
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const {
      currentCostReport,
      currentInstanceReport,
      currentStorageReport,
      currentQueryString,
      previousCostReport,
      previousInstanceReport,
      previousStorageReport,
      previousQueryString,
    } = this.props;

    if (!currentCostReport) {
      this.props.fetchReport(AwsReportType.cost, currentQueryString);
    }
    if (!currentInstanceReport) {
      this.props.fetchReport(AwsReportType.instanceType, currentQueryString);
    }
    if (!currentStorageReport) {
      this.props.fetchReport(AwsReportType.storage, currentQueryString);
    }
    if (!previousCostReport) {
      this.props.fetchReport(AwsReportType.cost, previousQueryString);
    }
    if (!previousInstanceReport) {
      this.props.fetchReport(AwsReportType.instanceType, previousQueryString);
    }
    if (!previousStorageReport) {
      this.props.fetchReport(AwsReportType.storage, previousQueryString);
    }
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    if (prevProps.currentQueryString !== this.props.currentQueryString) {
      this.props.fetchReport(AwsReportType.cost, this.props.currentQueryString);
      this.props.fetchReport(
        AwsReportType.instanceType,
        this.props.currentQueryString
      );
      this.props.fetchReport(
        AwsReportType.storage,
        this.props.currentQueryString
      );
    }
    if (prevProps.previousQueryString !== this.props.previousQueryString) {
      this.props.fetchReport(
        AwsReportType.cost,
        this.props.previousQueryString
      );
      this.props.fetchReport(
        AwsReportType.instanceType,
        this.props.previousQueryString
      );
      this.props.fetchReport(
        AwsReportType.storage,
        this.props.previousQueryString
      );
    }
  }

  public render() {
    const {
      currentCostReport,
      currentInstanceReport,
      currentStorageReport,
      groupBy,
      previousCostReport,
      previousInstanceReport,
      previousStorageReport,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformAwsReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'total'
    );
    const previousCostData = transformAwsReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'total'
    );

    // Instance data
    const currentInstanceData = transformAwsReport(
      currentInstanceReport,
      ChartType.daily,
      'date',
      'total'
    );
    const previousInstanceData = transformAwsReport(
      previousInstanceReport,
      ChartType.daily,
      'date',
      'total'
    );

    // Storage data
    const currentStorageData = transformAwsReport(
      currentStorageReport,
      ChartType.daily,
      'date',
      'total'
    );
    const previousStorageData = transformAwsReport(
      previousStorageReport,
      ChartType.daily,
      'date',
      'total'
    );

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
          <HistoricalTrendChart
            currentData={currentCostData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={chartStyles.chartHeight}
            previousData={previousCostData}
            title={t('aws_details.historical.cost_title', { groupBy })}
            xAxisLabel={t('aws_details.historical.day_of_month_label')}
            yAxisLabel={t('aws_details.historical.cost_label')}
          />
        </div>
        <div className={css(styles.instanceChart)}>
          <HistoricalTrendChart
            currentData={currentInstanceData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={chartStyles.chartHeight}
            previousData={previousInstanceData}
            title={t('aws_details.historical.instance_title', { groupBy })}
            xAxisLabel={t('aws_details.historical.day_of_month_label')}
            yAxisLabel={t('aws_details.historical.instance_label')}
          />
        </div>
        <div className={css(styles.storageChart)}>
          <HistoricalTrendChart
            currentData={currentStorageData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={chartStyles.chartHeight}
            previousData={previousStorageData}
            title={t('aws_details.historical.storage_title', { groupBy })}
            xAxisLabel={t('aws_details.historical.day_of_month_label')}
            yAxisLabel={t('aws_details.historical.storage_label')}
          />
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
  const currentCostReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.cost,
    currentQueryString
  );
  const currentCostReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.cost,
    currentQueryString
  );
  const currentInstanceReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.instanceType,
    currentQueryString
  );
  const currentInstanceReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.instanceType,
    currentQueryString
  );
  const currentStorageReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.storage,
    currentQueryString
  );
  const currentStorageReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.storage,
    currentQueryString
  );

  // Previous report
  const previousCostReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.cost,
    previousQueryString
  );
  const previousCostReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.cost,
    previousQueryString
  );
  const previousInstanceReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.instanceType,
    previousQueryString
  );
  const previousInstanceReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.instanceType,
    previousQueryString
  );
  const previousStorageReport = awsReportsSelectors.selectReport(
    state,
    AwsReportType.storage,
    previousQueryString
  );
  const previousStorageReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.storage,
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
  fetchReport: awsReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalBase, HistoricalModalProps };
