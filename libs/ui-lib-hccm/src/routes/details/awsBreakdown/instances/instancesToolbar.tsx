import type { AwsQuery } from '@koku-ui/api/queries/awsQuery';
import { getQuery } from '@koku-ui/api/queries/query';
import { ResourcePathsType } from '@koku-ui/api/resources/resource';
import type { Tag } from '@koku-ui/api/tags/tag';
import { TagPathsType, TagType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../../store/common';
import { createMapStateToProps } from '../../../../store/common';
import { tagActions, tagSelectors } from '../../../../store/tags';
import { accountKey, regionKey, tagKey } from '../../../../utils/props';
import { DataToolbar } from '../../../components/dataToolbar';
import type { ComputedReportItem } from '../../../utils/computedReport/getComputedReportItems';
import { isEqual } from '../../../utils/equal';
import type { Filter } from '../../../utils/filter';

interface InstancesToolbarOwnProps {
  hideAccount?: boolean;
  hideRegion?: boolean;
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

interface InstancesToolbarStateProps {
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface InstancesToolbarDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface InstancesToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type InstancesToolbarProps = InstancesToolbarOwnProps &
  InstancesToolbarStateProps &
  InstancesToolbarDispatchProps &
  WrappedComponentProps;

const resourcePathsType = ResourcePathsType.aws;
const tagPathsType = TagPathsType.aws;
const tagType = TagType.tag;

export class InstancesToolbarBase extends React.Component<InstancesToolbarProps, InstancesToolbarState> {
  protected defaultState: InstancesToolbarState = {};
  public state: InstancesToolbarState = { ...this.defaultState };

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

  public componentDidUpdate(prevProps: InstancesToolbarProps) {
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
    const { hideAccount, hideRegion, hideTag, intl, tagReport } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'instance' }),
        key: 'instance',
        resourceKey: 'instance_name',
      },
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'account' }),
        key: 'account',
        resourceKey: 'account_alias',
      },
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'operating_system' }),
        key: 'operating_system',
      },
      { name: intl.formatMessage(messages.filterByValues, { value: 'region' }), key: 'region' },
    ];
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
    const filteredOptions = hideRegion ? sortedOptions.filter(option => option.key !== regionKey) : sortedOptions;
    return hideAccount ? filteredOptions.filter(option => option.key !== accountKey) : filteredOptions;
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

const mapStateToProps = createMapStateToProps<InstancesToolbarOwnProps, InstancesToolbarStateProps>(
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

const mapDispatchToProps: InstancesToolbarDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const InstancesToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(InstancesToolbarBase);
const InstancesToolbar = injectIntl(InstancesToolbarConnect);

export { InstancesToolbar };
