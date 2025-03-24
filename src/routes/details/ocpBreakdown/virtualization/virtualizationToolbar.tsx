import type { ToolbarLabelGroup } from '@patternfly/react-core';
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
import { DataToolbar } from 'routes/components/dataToolbar';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import { tagKey } from 'utils/props';

interface VirtualizationToolbarOwnProps {
  hideCluster?: boolean;
  hideNode?: boolean;
  hideProject?: boolean;
  hideTag?: boolean;
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
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
    const { hideCluster, hideNode, hideProject, hideTag, intl, tagReport } = this.props;

    const options: { name: string; key: string; resourceKey?: string }[] = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'vm_name' }),
        key: 'vm_name',
      },
    ];
    if (!hideCluster) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
        key: 'cluster',
        resourceKey: 'cluster_alias',
      });
    }
    if (!hideNode) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'node' }),
        key: 'node',
      });
    }
    if (!hideProject) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'project' }),
        key: 'project',
      });
    }
    if (!hideTag && tagReport?.data?.length) {
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
        showExcludes
        showExport
        showFilter
        tagPathsType={tagPathsType}
        tagReport={tagReport}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<VirtualizationToolbarOwnProps, VirtualizationToolbarStateProps>(
  (state, { timeScopeValue = -1 }) => {
    // Note: Omitting key_only would help to share a single, cached request. Only the toolbar requires key values;
    // however, for better server-side performance, we chose to use key_only here.
    const tagQueryString = getQuery({
      filter: {
        time_scope_value: timeScopeValue,
      },
      key_only: true,
      limit: 1000,
    });

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

const VirtualizationToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(VirtualizationToolbarBase);
const VirtualizationToolbar = injectIntl(VirtualizationToolbarConnect);

export { VirtualizationToolbar };
