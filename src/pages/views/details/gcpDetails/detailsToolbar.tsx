import { ToolbarChipGroup } from '@patternfly/react-core';
import { GcpQuery, getQuery } from 'api/queries/gcpQuery';
import { tagKey } from 'api/queries/query';
import { ResourcePathsType } from 'api/resources/resource';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import { DataToolbar } from 'pages/views/components/dataToolbar/dataToolbar';
import React from 'react';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
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
  query?: GcpQuery;
  queryString?: string;
  selectedItems?: ComputedReportItem[];
}

interface DetailsToolbarStateProps {
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps & DetailsToolbarStateProps & DetailsToolbarDispatchProps;

const tagReportType = TagType.tag;
const tagReportPathsType = TagPathsType.gcp;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchTag, queryString } = this.props;
    fetchTag(tagReportPathsType, tagReportType, queryString);
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps) {
    const { fetchTag, query, queryString, tagReport } = this.props;
    if (query && !isEqual(query, prevProps.query)) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
    }
    if (!isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { tagReport } = this.props;
    const intl = createIntlEnv();

    const options = [
      { name: intl.formatMessage(messages.FilterByValuesTitleCase, { value: 'account' }), key: 'account' },
      { name: intl.formatMessage(messages.FilterByValuesTitleCase, { value: 'project' }), key: 'project' },
      { name: intl.formatMessage(messages.FilterByValuesTitleCase, { value: 'service' }), key: 'service' },
      { name: intl.formatMessage(messages.FilterByValuesTitleCase, { value: 'region' }), key: 'region' },
    ];

    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      options.push({ name: intl.formatMessage(messages.FilterByValuesTitleCase, { value: 'tag' }), key: tagKey });
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
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.gcp}
        selectedItems={selectedItems}
        showBulkSelect
        showExport
        showFilter
        tagReport={tagReport}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>((state, props) => {
  // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    // key_only: true
  });

  const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
  const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);
  return {
    queryString,
    tagReport,
    tagReportFetchStatus,
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const DetailsToolbar = DetailsToolbarConnect;

export { DetailsToolbar, DetailsToolbarProps };
