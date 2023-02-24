import type { ToolbarChipGroup } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { OcpTag } from 'api/tags/ocpTags';
import { TagPathsType, TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/views/components/dataToolbar';
import type { Filter } from 'routes/views/utils/filter';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';
import { tagKey } from 'utils/props';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isExportDisabled: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelected(action: string);
  onColumnManagementClicked();
  onExportClicked();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onPlatformCostsChanged(checked: boolean);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: ComputedReportItem[];
}

interface DetailsToolbarStateProps {
  tagReport?: OcpTag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface DetailsToolbarDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WrappedComponentProps;

const tagReportType = TagType.tag;
const tagReportPathsType = TagPathsType.ocp;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchTag, tagReportFetchStatus, tagQueryString } = this.props;

    this.setState(
      {
        categoryOptions: this.getCategoryOptions(),
      },
      () => {
        if (tagReportFetchStatus !== FetchStatus.inProgress) {
          fetchTag(tagReportPathsType, tagReportType, tagQueryString);
        }
      }
    );
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { fetchTag, query, tagReport, tagReportFetchStatus, tagQueryString } = this.props;
    if (!isEqual(tagReport, prevProps.tagReport)) {
      this.setState(
        {
          categoryOptions: this.getCategoryOptions(),
        },
        () => {
          if (tagReportFetchStatus !== FetchStatus.inProgress) {
            fetchTag(tagReportPathsType, tagReportType, tagQueryString);
          }
        }
      );
    } else if (query && !isEqual(query, prevProps.query) && tagReportFetchStatus !== FetchStatus.inProgress) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl, tagReport } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'node' }), key: 'node' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
    ];

    if (tagReport && tagReport.data && tagReport.data.length) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: tagKey }),
        key: tagKey,
      });
    }
    return options;
  };

  public render() {
    const {
      groupBy,
      isAllSelected,
      isDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onColumnManagementClicked,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      onPlatformCostsChanged,
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
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onColumnManagementClicked={onColumnManagementClicked}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        onPlatformCostsChanged={onPlatformCostsChanged}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.ocp}
        selectedItems={selectedItems}
        showBulkSelect
        showColumnManagement
        showExport
        showFilter
        showPlatformCosts={groupBy === 'project'}
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
  const tagQueryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    key_only: true,
    limit: 1000,
  });
  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
    state,
    tagReportPathsType,
    tagReportType,
    tagQueryString
  );
  return {
    tagReport,
    tagReportFetchStatus,
    tagQueryString,
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const DetailsToolbar = injectIntl(DetailsToolbarConnect);

export { DetailsToolbar };
export type { DetailsToolbarProps };
