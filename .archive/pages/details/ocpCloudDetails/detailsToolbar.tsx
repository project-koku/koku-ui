import { ToolbarChipGroup } from '@patternfly/react-core';
import { getQuery, OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { OcpCloudReport } from 'api/reports/ocpCloudReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { DataToolbar } from 'routes/details/components/dataToolbar/dataToolbar';
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
  query?: OcpCloudQuery;
  queryString?: string;
  report?: OcpCloudReport;
}

interface DetailsToolbarStateProps {
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;
const reportPathsType = ReportPathsType.ocpCloud;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
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

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { report, t } = this.props;

    const options = [
      { name: t('filter_by.values.cluster'), key: 'cluster' },
      { name: t('filter_by.values.node'), key: 'node' },
      { name: t('filter_by.values.project'), key: 'project' },
      { name: t('filter_by.values.tag'), key: 'tag' },
    ];

    return report && report.data && report.data.length
      ? options
      : options.filter(option => option.key !== 'tag');
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
      <DataToolbar
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
  // Omitting key_only to share a single request -- the toolbar needs key values
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
