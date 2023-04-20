import type { ToolbarChipGroup } from '@patternfly/react-core';
import type { Org, OrgPathsType } from 'api/orgs/org';
import { OrgType } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { ResourcePathsType } from 'api/resources/resource';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/views/components/dataToolbar';
import { DateRangeType, getDateRangeFromQuery, getDateRangeTypeDefault } from 'routes/views/utils/dateRange';
import type { Filter } from 'routes/views/utils/filter';
import { getRouteForQuery } from 'routes/views/utils/query';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';
import { formatStartEndDate } from 'utils/dates';
import { isEqual } from 'utils/equal';
import { orgUnitIdKey, tagKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { ExplorerDatePicker } from './explorerDatePicker';
import { ExplorerDateRange } from './explorerDateRange';
import { styles } from './explorerFilter.styles';
import type { PerspectiveType } from './explorerUtils';
import { dateRangeOptions, getGroupByOptions, getOrgReportPathsType, getTagReportPathsType } from './explorerUtils';

interface ExplorerFilterOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy: string;
  isDisabled?: boolean;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  perspective: PerspectiveType;
  pagination?: React.ReactNode;
  query?: Query;
  resourcePathsType?: ResourcePathsType;
}

interface ExplorerFilterStateProps {
  dateRangeType: DateRangeType;
  orgQueryString?: string;
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgPathsType?: OrgPathsType;
  tagQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagPathsType?: TagPathsType;
}

interface ExplorerFilterDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface ExplorerFilterState {
  categoryOptions?: ToolbarChipGroup[];
  currentDateRangeType?: string;
  showDatePicker?: boolean;
}

type ExplorerFilterProps = ExplorerFilterOwnProps & ExplorerFilterStateProps & ExplorerFilterDispatchProps;

const orgType = OrgType.org;
const tagType = TagType.tag;

export class ExplorerFilterBase extends React.Component<ExplorerFilterProps, ExplorerFilterState> {
  protected defaultState: ExplorerFilterState = {
    showDatePicker: false,
  };
  public state: ExplorerFilterState = { ...this.defaultState };

  public componentDidMount() {
    const { dateRangeType, fetchOrg, fetchTag, orgQueryString, orgPathsType, tagQueryString, tagPathsType } =
      this.props;

    if (orgPathsType) {
      fetchOrg(orgPathsType, orgType, orgQueryString);
    }
    if (tagPathsType) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
    this.setState({
      categoryOptions: this.getCategoryOptions(),
      currentDateRangeType: dateRangeType,
      showDatePicker: dateRangeType === DateRangeType.custom,
    });
  }

  public componentDidUpdate(prevProps: ExplorerFilterProps) {
    const {
      fetchOrg,
      fetchTag,
      orgQueryString,
      orgReport,
      orgPathsType,
      perspective,
      query,
      tagQueryString,
      tagReport,
      tagPathsType,
    } = this.props;

    if (query && !isEqual(query, prevProps.query)) {
      if (orgPathsType) {
        fetchOrg(orgPathsType, orgType, orgQueryString);
      }
      if (tagPathsType) {
        fetchTag(tagPathsType, tagType, tagQueryString);
      }
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
    // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
    if (prevProps.perspective !== perspective) {
      this.handleDateRangeSelected(dateRangeOptions[0].value);
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { orgReport, perspective, intl, tagReport } = this.props;

    const options = [];
    const groupByOptions = getGroupByOptions(perspective);
    groupByOptions.map(option => {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: option.label }),
        key: option.value,
      });
    });
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
        key: orgUnitIdKey,
      });
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: 'tag' }), key: tagKey });
    }
    return options;
  };

  private getDateRangeComponent = () => {
    const { isDisabled } = this.props;
    const { currentDateRangeType } = this.state;

    return (
      <ExplorerDateRange
        dateRangeType={currentDateRangeType}
        isDisabled={isDisabled}
        onSelected={this.handleDateRangeSelected}
        options={dateRangeOptions}
      />
    );
  };

  private getDatePickerComponent = () => {
    const { showDatePicker } = this.state;

    return showDatePicker ? <ExplorerDatePicker onSelected={this.handleDatePickerSelected} /> : undefined;
  };

  private handleDatePickerSelected = (startDate: Date, endDate: Date) => {
    const { query, router } = this.props;

    const { start_date, end_date } = formatStartEndDate(startDate, endDate);

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      dateRangeType: DateRangeType.custom,
      start_date,
      end_date,
    };
    router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
  };

  private handleDateRangeSelected = (value: string) => {
    const { query, router } = this.props;

    const showDatePicker = value === DateRangeType.custom;
    this.setState({ currentDateRangeType: value, showDatePicker }, () => {
      if (!showDatePicker) {
        const newQuery = {
          ...JSON.parse(JSON.stringify(query)),
          dateRangeType: value,
          start_date: undefined,
          end_date: undefined,
        };
        router.navigate(getRouteForQuery(newQuery, router.location), { replace: true });
      }
    });
  };

  public render() {
    const {
      groupBy,
      isDisabled,
      onFilterAdded,
      onFilterRemoved,
      orgReport,
      query,
      resourcePathsType,
      tagReport,
      tagPathsType,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        dateRange={this.getDateRangeComponent()}
        datePicker={this.getDatePickerComponent()}
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        orgReport={orgReport}
        query={query}
        resourcePathsType={resourcePathsType}
        style={styles.toolbarContainer}
        showFilter
        tagReport={tagReport}
        tagPathsType={tagPathsType}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerFilterOwnProps, ExplorerFilterStateProps>(
  (state, { perspective, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const dateRangeType = getDateRangeTypeDefault(queryFromRoute);
    const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

    // Omitting key_only to share a single request -- the toolbar needs key values
    const orgQueryString = getQuery({
      end_date,
      start_date,
      limit: 1000,
    });

    let orgReport;
    let orgReportFetchStatus;
    const orgPathsType = getOrgReportPathsType(perspective);
    if (orgPathsType) {
      orgReport = orgSelectors.selectOrg(state, orgPathsType, orgType, orgQueryString);
      orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);
    }

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const tagQueryString = getQuery({
      end_date,
      start_date,
      key_only: true,
      limit: 1000,
    });
    let tagReport;
    let tagReportFetchStatus;
    const tagPathsType = getTagReportPathsType(perspective);
    if (tagPathsType) {
      tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
      tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);
    }

    return {
      dateRangeType,
      orgQueryString,
      orgReport,
      orgReportFetchStatus,
      orgPathsType,
      tagQueryString,
      tagReport,
      tagReportFetchStatus,
      tagPathsType,
    };
  }
);

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilterConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase);
const ExplorerFilter = injectIntl(withRouter(ExplorerFilterConnect));

export { ExplorerFilter };
export type { ExplorerFilterProps };
