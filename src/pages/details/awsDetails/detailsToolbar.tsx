import { DataToolbarChipGroup } from '@patternfly/react-core';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import i18next from 'i18next';
import { Toolbar } from 'pages/details/components/toolbar/toolbar';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
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
  fetchReport?: typeof reportActions.fetchReport;
}

interface DetailsToolbarState {
  categoryOptions?: DataToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const defaultOptions = [
  { name: i18next.t('filter_by.values.account'), key: 'account' },
  { name: i18next.t('filter_by.values.service'), key: 'service' },
  { name: i18next.t('filter_by.values.region'), key: 'region' },
  { name: i18next.t('filter_by.values.tag'), key: 'tag' },
];

const reportType = ReportType.tag;
const reportPathsType = ReportPathsType.aws;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {
    categoryOptions: defaultOptions,
  };
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { fetchReport, query, queryString, report } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchReport(reportPathsType, reportType, queryString);
    }
    if (!isEqual(report, prevProps.report)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): DataToolbarChipGroup[] => {
    const { report } = this.props;

    return report && report.data && report.data.length
      ? defaultOptions
      : defaultOptions.filter(option => option.key !== 'tag');
  };

  public render() {
    const {
      groupBy,
      isExportDisabled,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      report,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <Toolbar
        categoryOptions={categoryOptions}
        groupBy={groupBy}
        isExportDisabled={isExportDisabled}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        report={report}
        showExport
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
    // key_only: true
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

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const DetailsToolbar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase)
);

export { DetailsToolbar, DetailsToolbarProps };
