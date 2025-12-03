import type { Org } from '@koku-ui/api/orgs/org';
import { OrgPathsType, OrgType } from '@koku-ui/api/orgs/org';
import type { AwsQuery } from '@koku-ui/api/queries/awsQuery';
import { getQuery } from '@koku-ui/api/queries/query';
import type { Resource } from '@koku-ui/api/resources/resource';
import { ResourcePathsType, ResourceType } from '@koku-ui/api/resources/resource';
import type { Tag } from '@koku-ui/api/tags/tag';
import { TagPathsType, TagType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../store/common';
import { createMapStateToProps } from '../../../store/common';
import { orgActions, orgSelectors } from '../../../store/orgs';
import { resourceActions, resourceSelectors } from '../../../store/resources';
import { tagActions, tagSelectors } from '../../../store/tags';
import { awsCategoryKey, orgUnitIdKey, tagKey } from '../../../utils/props';
import { DataToolbar } from '../../components/dataToolbar';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { isEqual } from '../../utils/equal';
import type { Filter } from '../../utils/filter';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelect(action: string);
  onExportClicked();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: AwsQuery;
  selectedItems?: ComputedReportItem[];
  timeScopeValue?: number;
}

interface DetailsToolbarStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgQueryString?: string;
  resourceReport?: Resource;
  resourceReportFetchStatus?: FetchStatus;
  resourceQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface DetailsToolbarDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchResource?: typeof resourceActions.fetchResource;
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WrappedComponentProps;

const orgPathsType = OrgPathsType.aws;
const orgType = OrgType.org;
const resourcePathsType = ResourcePathsType.aws;
const resourceType = ResourceType.aws_category;
const tagPathsType = TagPathsType.aws;
const tagType = TagType.tag;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps, DetailsToolbarState> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState(
      {
        categoryOptions: this.getCategoryOptions(),
      },
      () => {
        this.updateReport();
      }
    );
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { orgReport, query, resourceReport, tagQueryString, tagReport } = this.props;

    if (
      !isEqual(orgReport, prevProps.orgReport) ||
      !isEqual(resourceReport, prevProps.resourceReport) ||
      !isEqual(tagReport, prevProps.tagReport)
    ) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
    if (
      (query && !isEqual(query, prevProps.query)) ||
      (tagQueryString && !isEqual(tagQueryString, prevProps.tagQueryString))
    ) {
      this.updateReport();
    }
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { intl, orgReport, resourceReport, tagReport } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'account' }),
        key: 'account',
        resourceKey: 'account_alias',
      },
      { name: intl.formatMessage(messages.filterByValues, { value: 'service' }), key: 'service' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'region' }), key: 'region' },
    ];
    if (orgReport?.data?.length) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
        key: orgUnitIdKey,
      });
    }
    if (tagReport?.data?.length) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: tagKey }), key: tagKey });
    }
    if (resourceReport?.data?.length) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: awsCategoryKey }),
        key: awsCategoryKey,
      });
    }
    return options.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  private updateReport = () => {
    const { fetchOrg, fetchResource, fetchTag, orgQueryString, resourceQueryString, tagQueryString } = this.props;
    fetchOrg(orgPathsType, orgType, orgQueryString);
    fetchResource(resourcePathsType, resourceType, resourceQueryString);
    fetchTag(tagPathsType, tagType, tagQueryString);
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
      onBulkSelect,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      orgReport,
      pagination,
      query,
      resourceReport,
      selectedItems,
      tagReport,
      timeScopeValue,
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
        onBulkSelect={onBulkSelect}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        orgReport={orgReport}
        pagination={pagination}
        query={query}
        resourcePathsType={resourcePathsType}
        resourceReport={resourceReport}
        selectedItems={selectedItems}
        showBulkSelect
        showCriteria
        showExport
        showFilter
        tagPathsType={tagPathsType}
        tagReport={tagReport}
        timeScopeValue={timeScopeValue}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>(
  (state, { timeScopeValue = -1 }) => {
    // Note: Omitting key_only would help to share a single, cached request. Only the toolbar requires key values;
    // however, for better server-side performance, we chose to use key_only here.
    const baseQuery = {
      filter: {
        time_scope_value: timeScopeValue,
      },
      key_only: true,
      limit: 1000,
    };

    const resourceQueryString = getQuery({
      key_only: true,
    });
    const resourceReport = resourceSelectors.selectResource(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );
    const resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );

    const tagQueryString = getQuery({
      ...baseQuery,
    });
    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

    const orgQueryString = getQuery({
      ...baseQuery,
    });
    const orgReport = orgSelectors.selectOrg(state, orgPathsType, orgType, orgQueryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);

    return {
      orgReport,
      orgReportFetchStatus,
      orgQueryString,
      resourceReport,
      resourceReportFetchStatus,
      resourceQueryString,
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchResource: resourceActions.fetchResource,
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const DetailsToolbar = injectIntl(DetailsToolbarConnect);

export { DetailsToolbar };
export type { DetailsToolbarProps };
