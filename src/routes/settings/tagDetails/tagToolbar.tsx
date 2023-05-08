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
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';
import { tagKey } from 'utils/props';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
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

const tagType = TagType.tag;
const tagPathsType = TagPathsType.ocp;

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

  private updateReport = () => {
    const { fetchTag, tagQueryString } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  };

  public render() {
    const {
      isAllSelected,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
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
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.ocp}
        selectedItems={selectedItems}
        showBulkSelect
        showFilter
        tagReport={tagReport}
        tagPathsType={tagPathsType}
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
  const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);
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
const TagToolbar = injectIntl(DetailsToolbarConnect);

export { TagToolbar };
export type { DetailsToolbarProps };
