import type { AzureQuery } from '@koku-ui/api/queries/azureQuery';
import { getQuery } from '@koku-ui/api/queries/azureQuery';
import { ResourcePathsType } from '@koku-ui/api/resources/resource';
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
import { tagActions, tagSelectors } from '../../../store/tags';
import { tagKey } from '../../../utils/props';
import { DataToolbar } from '../../components/dataToolbar';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { isEqual } from '../../utils/equal';
import type { Filter } from '../../utils/filter';

interface DetailsToolbarOwnProps {
  isAllSelected?: boolean;
  isExportDisabled: boolean;
  isDisabled?: boolean;
  items?: ComputedReportItem[];
  itemsPerPage?: number;
  itemsTotal?: number;
  groupBy: string;
  onBulkSelect(action: string);
  onExportClicked();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: AzureQuery;
  selectedItems?: ComputedReportItem[];
  timeScopeValue?: number;
}

interface DetailsToolbarStateProps {
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface DetailsToolbarDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WrappedComponentProps;

const tagType = TagType.tag;
const tagPathsType = TagPathsType.azure;

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
    const { query, tagQueryString, tagReport } = this.props;

    if (!isEqual(tagReport, prevProps.tagReport)) {
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
    const { intl, tagReport } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'subscription_guid' }),
        key: 'subscription_guid',
        resourceKey: 'account_alias',
      },
      { name: intl.formatMessage(messages.filterByValues, { value: 'service_name' }), key: 'service_name' },
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'resource_location' }),
        key: 'resource_location',
      },
    ];

    if (tagReport?.data?.length) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: tagKey }), key: tagKey });
    }
    return options;
  };

  private updateReport = () => {
    const { fetchTag, tagQueryString } = this.props;
    fetchTag(tagPathsType, tagType, tagQueryString);
  };

  public render() {
    const {
      groupBy,
      isAllSelected,
      isDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelect,
      onExportClicked,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
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
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelect={onBulkSelect}
        onExportClicked={onExportClicked}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.azure}
        selectedItems={selectedItems}
        showBulkSelect
        showCriteria
        showExport
        showFilter
        tagReport={tagReport}
        tagPathsType={tagPathsType}
        timeScopeValue={timeScopeValue}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>(
  (state, { timeScopeValue = -1 }) => {
    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
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
      tagReportFetchStatus,
      tagReport,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const DetailsToolbar = injectIntl(DetailsToolbarConnect);

export { DetailsToolbar };
export type { DetailsToolbarProps };
