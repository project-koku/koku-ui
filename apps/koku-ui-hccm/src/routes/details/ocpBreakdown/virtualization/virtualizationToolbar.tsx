import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { AwsQuery } from 'api/queries/awsQuery';
import { getQuery, parseQuery, type Query } from 'api/queries/query';
import { ResourcePathsType } from 'api/resources/resource';
import type { Tag } from 'api/tags/tag';
import { TagPathsType, TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/components/dataToolbar';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/utils/groupBy';
import { getQueryState } from 'routes/utils/queryState';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { logicalAndPrefix, orgUnitIdKey, platformCategoryKey, tagKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface VirtualizationToolbarOwnProps extends RouterComponentProps {
  isTagHidden?: boolean;
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isClusterHidden?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  isNodeHidden?: boolean;
  isProjectHidden?: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
  onColumnManagementClicked();
  onExportClicked();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: AwsQuery;
  selectedItems?: ComputedReportItem[];
  timeScopeValue?: number;
}

interface VirtualizationToolbarStateProps {
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface VirtualizationToolbarDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface VirtualizationToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type VirtualizationToolbarProps = VirtualizationToolbarOwnProps &
  VirtualizationToolbarStateProps &
  VirtualizationToolbarDispatchProps &
  WrappedComponentProps;

const resourcePathsType = ResourcePathsType.ocp;
const tagPathsType = TagPathsType.ocp;
const tagType = TagType.tag;

export class VirtualizationToolbarBase extends React.Component<VirtualizationToolbarProps, VirtualizationToolbarState> {
  protected defaultState: VirtualizationToolbarState = {};
  public state: VirtualizationToolbarState = { ...this.defaultState };

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

  public componentDidUpdate(prevProps: VirtualizationToolbarProps) {
    const { query, tagReport } = this.props;

    if (!isEqual(tagReport, prevProps.tagReport)) {
      this.setState(
        {
          categoryOptions: this.getCategoryOptions(),
        },
        () => {
          this.updateReport();
        }
      );
    } else if (query && !isEqual(query, prevProps.query)) {
      this.updateReport();
    }
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { isClusterHidden, isNodeHidden, isProjectHidden, isTagHidden, intl, tagReport } = this.props;

    const options: { name: string; key: string; resourceKey?: string }[] = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'vm_name' }),
        key: 'vm_name',
      },
    ];
    if (!isClusterHidden) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
        key: 'cluster',
        resourceKey: 'cluster_alias',
      });
    }
    if (!isNodeHidden) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'node' }),
        key: 'node',
      });
    }
    if (!isProjectHidden) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'project' }),
        key: 'project',
      });
    }
    if (!isTagHidden && tagReport?.data?.length) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: tagKey }), key: tagKey });
    }
    const sortedOptions = options.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return sortedOptions;
  };

  private updateReport = () => {
    const { fetchTag, tagQueryString } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  };

  public render() {
    const {
      isAllSelected,
      isBulkSelectDisabled,
      isDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelect,
      onColumnManagementClicked,
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
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isBulkSelectDisabled={isBulkSelectDisabled}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelect={onBulkSelect}
        onColumnManagementClicked={onColumnManagementClicked}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={resourcePathsType}
        selectedItems={selectedItems}
        showBulkSelect
        showColumnManagement
        showCriteria
        showExport
        showFilter
        tagPathsType={tagPathsType}
        tagReport={tagReport}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<VirtualizationToolbarOwnProps, VirtualizationToolbarStateProps>(
  (state, { router, timeScopeValue = -1 }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(queryFromRoute);
    const groupByValue = groupByOrgValue || getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';

    // Prune unsupported tag params from filter_by, but don't reset queryState
    const filterByParams = {
      ...(queryState?.filter_by ? queryState.filter_by : {}),
    };
    for (const key of Object.keys(filterByParams)) {
      // Omit unsupported query params
      if (
        key.indexOf('node') !== -1 ||
        key.indexOf('region') !== -1 ||
        key.indexOf('resource_location') !== -1 ||
        key.indexOf('service') !== -1 ||
        key.indexOf(tagPrefix) !== -1
      ) {
        delete filterByParams[key];
      }
    }

    const tagQuery = {
      filter: {
        time_scope_value: timeScopeValue,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...filterByParams,
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        // Related to https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(isFilterByExact && {
          [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
          [`exact:${groupBy}`]: groupByValue,
        }),
      },
      // Note: Omitting key_only would help to share a single, cached request. Only the toolbar requires key values;
      // however, for better server-side performance, we chose to use key_only here.
      key_only: true,
      limit: 1000,
    };

    const tagQueryString = getQuery(tagQuery);
    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

    return {
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: VirtualizationToolbarDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const VirtualizationToolbarConnect = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VirtualizationToolbarBase)
);
const VirtualizationToolbar = injectIntl(VirtualizationToolbarConnect);

export { VirtualizationToolbar };
