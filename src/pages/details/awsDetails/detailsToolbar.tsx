import { ToolbarChipGroup } from '@patternfly/react-core';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { orgUnitIdKey, tagKey } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { DataToolbar } from 'pages/details/components/dataToolbar/dataToolbar';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { tagActions, tagSelectors } from 'store/tags';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isExportDisabled?: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelected(action: string);
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: AwsQuery;
  queryString?: string;
  selectedItems?: ComputedReportItem[];
}

interface DetailsToolbarStateProps {
  orgReport?: Report;
  orgReportFetchStatus?: FetchStatus;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WithTranslation;

const reportPathsType = ReportPathsType.aws;
const orgReportType = ReportType.org;
const tagReportPathsType = TagPathsType.aws;
const tagReportType = TagType.tag;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchReport, fetchTag, queryString } = this.props;
    fetchReport(reportPathsType, orgReportType, queryString);
    fetchTag(tagReportPathsType, tagReportType, queryString);
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { fetchReport, fetchTag, orgReport, query, queryString, tagReport } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchReport(reportPathsType, orgReportType, queryString);
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { orgReport, t, tagReport } = this.props;

    const options = [
      { name: t('filter_by.values.account'), key: 'account' },
      { name: t('filter_by.values.service'), key: 'service' },
      { name: t('filter_by.values.region'), key: 'region' },
    ];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      options.push({
        name: t('filter_by.values.org_unit_id'),
        key: orgUnitIdKey,
      });
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      options.push({ name: t('filter_by.values.tag'), key: tagKey });
    }
    return options;
  };

  public render() {
    const {
      groupBy,
      isAllSelected,
      isBulkSelectDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      orgReport,
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
        isBulkSelectDisabled={isBulkSelectDisabled}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        orgReport={orgReport}
        pagination={pagination}
        query={query}
        selectedItems={selectedItems}
        showExport
        tagReport={tagReport}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>((state, props) => {
  // Omitting key_only to share a single request -- the toolbar needs key values
  const queryString = getQuery({
    // key_only: true
  });
  const orgReport = reportSelectors.selectReport(state, reportPathsType, orgReportType, queryString);
  const orgReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    orgReportType,
    queryString
  );
  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);
  return {
    queryString,
    orgReport,
    orgReportFetchStatus,
    tagReport,
    tagReportFetchStatus,
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: reportActions.fetchReport,
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbar = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase));

export { DetailsToolbar, DetailsToolbarProps };
