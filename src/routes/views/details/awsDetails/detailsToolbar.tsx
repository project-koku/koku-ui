import type { ToolbarChipGroup } from '@patternfly/react-core';
import type { Org } from 'api/orgs/org';
import { OrgPathsType, OrgType } from 'api/orgs/org';
import type { AwsQuery } from 'api/queries/awsQuery';
import { getQuery } from 'api/queries/query';
import { ResourcePathsType } from 'api/resources/resource';
import type { Tag } from 'api/tags/tag';
import { TagPathsType, TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/views/components/dataToolbar';
import type { Filter } from 'routes/views/utils/filter';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';
import { orgUnitIdKey, tagKey } from 'utils/props';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelected(action: string);
  onExportClicked();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: AwsQuery;
  selectedItems?: ComputedReportItem[];
}

interface DetailsToolbarStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface DetailsToolbarDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WrappedComponentProps;

const orgReportPathsType = OrgPathsType.aws;
const orgReportType = OrgType.org;
const tagReportPathsType = TagPathsType.aws;
const tagReportType = TagType.tag;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchOrg, fetchTag, orgReportFetchStatus, orgQueryString, tagReportFetchStatus, tagQueryString } =
      this.props;

    this.setState(
      {
        categoryOptions: this.getCategoryOptions(),
      },
      () => {
        if (orgReportFetchStatus !== FetchStatus.inProgress) {
          fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
        }
        if (tagReportFetchStatus !== FetchStatus.inProgress) {
          fetchTag(tagReportPathsType, tagReportType, tagQueryString);
        }
      }
    );
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const {
      fetchOrg,
      fetchTag,
      orgReport,
      orgReportFetchStatus,
      query,
      orgQueryString,
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    } = this.props;

    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState(
        {
          categoryOptions: this.getCategoryOptions(),
        },
        () => {
          if (orgReportFetchStatus !== FetchStatus.inProgress) {
            fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
          }
          if (tagReportFetchStatus !== FetchStatus.inProgress) {
            fetchTag(tagReportPathsType, tagReportType, tagQueryString);
          }
        }
      );
    } else if (query && !isEqual(query, prevProps.query)) {
      if (orgReportFetchStatus !== FetchStatus.inProgress) {
        fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
      }
      if (tagReportFetchStatus !== FetchStatus.inProgress) {
        fetchTag(tagReportPathsType, tagReportType, tagQueryString);
      }
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl, orgReport, tagReport } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'account' }), key: 'account' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'service' }), key: 'service' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'region' }), key: 'region' },
    ];
    if (orgReport && orgReport.data && orgReport.data.length) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
        key: orgUnitIdKey,
      });
    }
    if (tagReport && tagReport.data && tagReport.data.length) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: 'tag' }), key: tagKey });
    }
    return options;
  };

  public render() {
    const {
      groupBy,
      isAllSelected,
      isBulkSelectDisabled,
      isDisabled,
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
        isDisabled={isDisabled}
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
        resourcePathsType={ResourcePathsType.aws}
        selectedItems={selectedItems}
        showBulkSelect
        showExport
        showFilter
        tagReport={tagReport}
        tagReportPathsType={tagReportPathsType}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>((state, props) => {
  // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
  // However, for better server-side performance, we chose to use key_only here.
  const baseQuery = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    key_only: true,
    limit: 1000,
  };

  const tagQueryString = getQuery({
    ...baseQuery,
  });
  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
    state,
    tagReportPathsType,
    tagReportType,
    tagQueryString
  );

  const orgQueryString = getQuery({
    ...baseQuery,
  });
  const orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, orgQueryString);
  const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(
    state,
    orgReportPathsType,
    orgReportType,
    orgQueryString
  );
  return {
    orgReport,
    orgReportFetchStatus,
    orgQueryString,
    tagReport,
    tagReportFetchStatus,
    tagQueryString,
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const DetailsToolbar = injectIntl(DetailsToolbarConnect);

export { DetailsToolbar };
export type { DetailsToolbarProps };
