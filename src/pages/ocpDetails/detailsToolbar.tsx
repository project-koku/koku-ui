import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { DetailsDataToolbar } from 'components/details/detailsDataToolbar';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  groupBy: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  queryString?: string;
  report?: OcpReport;
}

interface DetailsToolbarStateProps {
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const reportType = OcpReportType.tag;

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

  private getCategoryOptions = () => {
    const { t } = this.props;

    return [
      { label: t('filter_by.values.cluster'), value: 'cluster' },
      { label: t('filter_by.values.node'), value: 'node' },
      { label: t('filter_by.values.project'), value: 'project' },
      { label: t('filter_by.values.tag'), value: 'tag' },
    ];
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
      <DetailsDataToolbar
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
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsToolbar = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsToolbarBase)
);

export { DetailsToolbar, DetailsToolbarProps };
