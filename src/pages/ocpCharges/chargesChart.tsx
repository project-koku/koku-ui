import { Report, ReportType } from 'api/reports';
import { PieChart } from 'components/pieChart/pieChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';

interface ChargesChartOwnProps {
  currentGroupBy: any;
  queryString: string;
}

interface ChargesChartStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface ChargesChartDispatchProps {
  fetchReport?: typeof reportsActions.fetchReport;
}

type ChargesChartProps = ChargesChartOwnProps &
  ChargesChartStateProps &
  ChargesChartDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.cost;

class ChargesChartBase extends React.Component<ChargesChartProps> {
  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(reportType, queryString);
    }
  }

  public componentDidUpdate(prevProps: ChargesChartProps) {
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
  ChargesChartOwnProps,
  ChargesChartStateProps
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

const mapDispatchToProps: ChargesChartDispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

const ChargesChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChargesChartBase)
);

export { ChargesChart, ChargesChartBase, ChargesChartProps };
