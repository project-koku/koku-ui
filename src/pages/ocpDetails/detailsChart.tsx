import { Report, ReportType } from 'api/reports';
import { PieChart } from 'components/pieChart/pieChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';

interface DetailsChartOwnProps {
  currentGroupBy: any;
  queryString: string;
}

interface DetailsChartStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof reportsActions.fetchReport;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;

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
    return (
      <PieChart
        height={200}
        width={200}
        data={report}
        formatDatumValue={formatValue}
        groupBy={currentGroupBy}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsChartOwnProps,
  DetailsChartStateProps
>((state, { queryString }) => {
  const report = reportsSelectors.selectReport(
    state,
    ReportType.cost,
    queryString
  );
  const reportFetchStatus = reportsSelectors.selectReportFetchStatus(
    state,
    ReportType.cost,
    queryString
  );
  return { report, reportFetchStatus };
});

const mapDispatchToProps: DetailsChartDispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

const DetailsChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartBase)
);

export { DetailsChart, DetailsChartBase, DetailsChartProps };
