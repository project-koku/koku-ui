import { AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { DetailsDataToolbar } from 'components/details/detailsDataToolbar';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  exportText: string;
  groupBy: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: AwsQuery;
  queryString?: string;
  report?: AwsReport;
}

interface DetailsToolbarStateProps {
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const categoryOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
  { label: 'tag', value: 'tag' },
];

const reportType = AwsReportType.tag;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { fetchReport, query, queryString } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const {
      exportText,
      groupBy,
      isExportDisabled,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      report,
    } = this.props;

    return (
      <DetailsDataToolbar
        categoryOptions={categoryOptions}
        exportText={exportText}
        groupBy={groupBy}
        isExportDisabled={isExportDisabled}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        report={report}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsToolbarOwnProps,
  DetailsToolbarStateProps
>(state => {
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
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

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsToolbar = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsToolbarBase)
);

export { DetailsToolbar, DetailsToolbarProps };
