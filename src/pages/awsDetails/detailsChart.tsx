import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  ChartType,
  transformAwsReport,
} from 'components/commonChart/chartUtils';
import { PieChart } from 'components/pieChart/pieChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatCurrency, formatValue } from 'utils/formatValue';

interface DetailsChartOwnProps {
  currentGroupBy: any;
  queryString: string;
}

interface DetailsChartStateProps {
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

const reportType = AwsReportType.cost;

class DetailsChartBase extends React.Component<DetailsChartProps> {
  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(reportType, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsChartProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(reportType, this.props.queryString);
    }
  }
  public render() {
    const { currentGroupBy, report } = this.props;
    const currentData = transformAwsReport(
      report,
      ChartType.monthly,
      currentGroupBy
    );
    const legendData = currentData.map(item => ({
      name: item.name.toString() + ' (' + formatCurrency(item.y) + ')',
      symbol: { type: 'square' },
    }));

    return (
      <PieChart
        height={200}
        width={200}
        data={currentData}
        formatDatumValue={formatValue}
        groupBy={currentGroupBy}
        legendData={legendData}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsChartOwnProps,
  DetailsChartStateProps
>((state, { queryString }) => {
  const report = awsReportsSelectors.selectReport(
    state,
    AwsReportType.cost,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.cost,
    queryString
  );
  return { report, reportFetchStatus };
});

const mapDispatchToProps: DetailsChartDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartBase)
);

export { DetailsChart, DetailsChartBase, DetailsChartProps };
