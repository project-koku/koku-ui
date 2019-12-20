import { getQuery } from 'api/ocpOnCloudQuery';
import { OcpOnCloudReport, OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnCloudReportsActions,
  ocpOnCloudReportsSelectors,
} from 'store/ocpOnCloudReports';
import { ComputedOcpOnCloudReportItem } from 'utils/getComputedOcpOnCloudReportItems';

interface DetailsTagViewOwnProps {
  groupBy: string;
  item: ComputedOcpOnCloudReportItem;
  project: string | number;
}

interface DetailsTagViewStateProps {
  queryString?: string;
  report?: OcpOnCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagViewDispatchProps {
  fetchReport?: typeof ocpOnCloudReportsActions.fetchReport;
}

type DetailsTagViewProps = DetailsTagViewOwnProps &
  DetailsTagViewStateProps &
  DetailsTagViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnCloudReportType.tag;

class DetailsTagViewBase extends React.Component<DetailsTagViewProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
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
>((state, { project }) => {
  const queryString = getQuery({
    filter: {
      project,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = ocpOnCloudReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpOnCloudReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpOnCloudReportsActions.fetchReport,
};

const DetailsTagView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsTagViewBase)
);

export { DetailsTagView, DetailsTagViewProps };
