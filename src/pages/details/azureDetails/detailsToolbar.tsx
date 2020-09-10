import { ToolbarChipGroup } from '@patternfly/react-core';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { tagKey } from 'api/queries/query';
import { AzureReport } from 'api/reports/azureReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { DataToolbar } from 'pages/details/components/dataToolbar/dataToolbar';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isExportDisabled: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelected(action: string);
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: AzureQuery;
  queryString?: string;
  selectedItems?: ComputedReportItem[];
}

interface DetailsToolbarStateProps {
  tagReport?: AzureReport;
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
const reportPathsType = ReportPathsType.azure;

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

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { fetchReport, query, queryString, tagReport } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchReport(reportPathsType, reportType, queryString);
    }
    if (!isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { tagReport, t } = this.props;

    const options = [
      {
        name: t('filter_by.values.subscription_guid'),
        key: 'subscription_guid',
      },
      { name: t('filter_by.values.service_name'), key: 'service_name' },
      {
        name: t('filter_by.values.resource_location'),
        key: 'resource_location',
      },
      { name: t('filter_by.values.tag'), key: tagKey },
    ];

    return tagReport && tagReport.data && tagReport.data.length
      ? options
      : options.filter(option => option.key !== tagKey);
  };

  public render() {
    const {
      groupBy,
      isAllSelected,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      selectedItems,
      tagReport,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        groupBy={groupBy}
        isAllSelected={isAllSelected}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        selectedItems={selectedItems}
        showExport
        tagReport={tagReport}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>(state => {
  // Omitting key_only to share a single request -- the toolbar needs key values
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    // key_only: true
  });
  const tagReport = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);
  return {
    queryString,
    reportFetchStatus,
    tagReport,
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const DetailsToolbar = translate()(connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase));

export { DetailsToolbar, DetailsToolbarProps };
