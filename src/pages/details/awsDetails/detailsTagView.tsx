import { getQuery } from 'api/queries/awsQuery';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface DetailsTagViewOwnProps {
  account: string | number;
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsTagViewStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagViewDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type DetailsTagViewProps = DetailsTagViewOwnProps &
  DetailsTagViewStateProps &
  DetailsTagViewDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;
const reportPathsType = ReportPathsType.aws;

class DetailsTagViewBase extends React.Component<DetailsTagViewProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getTags = () => {
    const { report } = this.props;
    const tags = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          tags.push(`${(tag as any).key}: ${val}`);
        }
      }
    }
    return tags;
  };

  public render() {
    const tags = this.getTags();

    return tags.map((tag, index) => <div key={`tag-${index}`}>{tag}</div>);
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagViewOwnProps,
  DetailsTagViewStateProps
>((state, { account }) => {
  const queryString = getQuery({
    filter: {
      account,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = reportSelectors.selectReport(state, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagViewDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const DetailsTagView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsTagViewBase)
);

export { DetailsTagView, DetailsTagViewProps };
