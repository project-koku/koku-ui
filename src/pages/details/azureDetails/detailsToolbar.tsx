import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { AzureReport } from 'api/reports/azureReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
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
  query?: AzureQuery;
  queryString?: string;
  report?: AzureReport;
}

interface DetailsToolbarStateProps {
  report?: AzureReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;
const reportPathsType = ReportPathsType.azure;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { fetchReport, query, queryString } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getCategoryOptions = () => {
    const { report, t } = this.props;

    const options = [
      {
        label: t('filter_by.values.subscription_guid'),
        value: 'subscription_guid',
      },
      { label: t('filter_by.values.service_name'), value: 'service_name' },
      {
        label: t('filter_by.values.resource_location'),
        value: 'resource_location',
      },
      { label: t('filter_by.values.tag'), value: 'tag' },
    ];
    return report && report.data && report.data.length
      ? options
      : options.filter(option => option.value !== 'tag');
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

    return (
      <Toolbar
        categoryOptions={this.getCategoryOptions()}
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

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const DetailsToolbar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase)
);

export { DetailsToolbar, DetailsToolbarProps };
