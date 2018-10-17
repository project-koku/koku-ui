import { Report, ReportType } from 'api/reports';
import { PieChart } from 'components/pieChart/pieChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';

interface CostChartOwnProps {
  currentGroupBy: any;
  queryString: string;
}

interface CostChartStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface CostChartDispatchProps {
  fetchReport?: typeof reportsActions.fetchReport;
}

type CostChartProps = CostChartOwnProps &
  CostChartStateProps &
  CostChartDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;

class CostChartBase extends React.Component<CostChartProps> {
  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(reportType, queryString);
    }
  }

  public componentDidUpdate(prevProps: CostChartProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(reportType, this.props.queryString);
    }
  }
  public render() {
    const { currentGroupBy, report } = this.props;
    return (
      <PieChart
        height={150}
        width={400}
        data={report}
        formatDatumValue={formatValue}
        groupBy={currentGroupBy}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<
  CostChartOwnProps,
  CostChartStateProps
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

const mapDispatchToProps: CostChartDispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

const CostChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CostChartBase)
);

export { CostChart, CostChartBase, CostChartProps };
