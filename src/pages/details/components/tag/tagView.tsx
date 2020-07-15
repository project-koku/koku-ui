import {getQuery, parseQuery, Query} from 'api/queries/query';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

interface TagViewOwnProps {
  filterBy: string | number;
  groupBy: string;
  reportPathsType: ReportPathsType;
}

interface TagViewStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface TagViewDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type TagViewProps = TagViewOwnProps &
  TagViewStateProps &
  TagViewDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;

class TagViewBase<T extends ReportPathsType> extends React.Component<
  TagViewProps
> {
  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: TagViewProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
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
  TagViewOwnProps,
  TagViewStateProps
>((state, { filterBy, groupBy, reportPathsType }) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const queryString = getQuery({
    filter: {
      [groupBy]: filterBy,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
      ...(queryFromRoute.filter.account && {account: queryFromRoute.filter.account})
    },
  });
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: TagViewDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const TagView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(TagViewBase)
);

export { TagView, TagViewProps };
