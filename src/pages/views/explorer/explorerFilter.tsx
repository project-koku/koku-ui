import { ToolbarChipGroup } from '@patternfly/react-core';
import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagKey } from 'api/queries/query';
import { ResourcePathsType } from 'api/resources/resource';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { DataToolbar } from 'pages/views/components/dataToolbar/dataToolbar';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';
import { getLast60DaysDate } from 'utils/dateRange';
import { isEqual } from 'utils/equal';

import { DateRange } from './dateRange';
import { styles } from './explorerFilter.styles';
import {
  dateRangeOptions,
  DateRangeType,
  getDateRangeDefault,
  getGroupByOptions,
  getOrgReportPathsType,
  getRouteForQuery,
  getTagReportPathsType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerFilterOwnProps {
  groupBy: string;
  isDisabled?: boolean;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  orgQueryString?: string;
  pagination?: React.ReactNode;
  perspective: PerspectiveType;
  query?: Query;
  resourcePathsType?: ResourcePathsType;
  tagQueryString?: string;
}

interface ExplorerFilterStateProps {
  dateRange: DateRangeType;
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgReportPathsType?: OrgPathsType;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagReportPathsType?: TagPathsType;
}

interface ExplorerFilterDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface ExplorerFilterState {
  categoryOptions?: ToolbarChipGroup[];
  currentDateRange?: DateRangeType;
}

type ExplorerFilterProps = ExplorerFilterOwnProps &
  ExplorerFilterStateProps &
  ExplorerFilterDispatchProps &
  RouteComponentProps<void> &
  WithTranslation;

const orgReportType = OrgType.org;
const tagReportType = TagType.tag;

export class ExplorerFilterBase extends React.Component<ExplorerFilterProps> {
  protected defaultState: ExplorerFilterState = {};
  public state: ExplorerFilterState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchOrg, fetchTag, orgQueryString, orgReportPathsType, tagQueryString, tagReportPathsType } = this.props;

    if (orgReportPathsType) {
      fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
    }
    if (tagReportPathsType) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
    this.setState({
      categoryOptions: this.getCategoryOptions(),
      currentDateRange: this.getDefaultDateRange(),
    });
  }

  public componentDidUpdate(prevProps: ExplorerFilterProps) {
    const {
      fetchOrg,
      fetchTag,
      orgQueryString,
      orgReport,
      orgReportPathsType,
      perspective,
      query,
      tagQueryString,
      tagReport,
      tagReportPathsType,
    } = this.props;

    if (query && !isEqual(query, prevProps.query)) {
      if (orgReportPathsType) {
        fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
      }
      if (tagReportPathsType) {
        fetchTag(tagReportPathsType, tagReportType, tagQueryString);
      }
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
    // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
    if (prevProps.perspective !== perspective) {
      this.handleDateRangeClick(dateRangeOptions[0].value);
    }
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { orgReport, perspective, t, tagReport } = this.props;

    const options = [];
    const groupByOptions = getGroupByOptions(perspective);
    groupByOptions.map(option => {
      options.push({
        name: t(`filter_by.values.${option.label}`),
        key: option.value,
      });
    });
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      options.push({
        name: t('filter_by.values.org_unit_id'),
        key: orgUnitIdKey,
      });
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      options.push({ name: t('filter_by.values.tag'), key: tagKey });
    }
    return options;
  };

  private getDefaultDateRange = () => {
    const { dateRange } = this.props;

    return dateRange ? dateRange : dateRangeOptions[0];
  };

  private getDateRange = () => {
    const { isDisabled } = this.props;
    const { currentDateRange } = this.state;

    return (
      <DateRange
        currentItem={currentDateRange}
        isDisabled={isDisabled}
        onItemClicked={this.handleDateRangeClick}
        options={dateRangeOptions}
      />
    );
  };

  private handleDateRangeClick = (value: string) => {
    const { history, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      dateRange: value,
    };
    history.replace(getRouteForQuery(history, newQuery, true));
    this.setState({ currentDateRange: value });
  };

  public render() {
    const { groupBy, isDisabled, onFilterAdded, onFilterRemoved, orgReport, query, resourcePathsType, tagReport } =
      this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        dateRange={this.getDateRange()}
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
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerFilterOwnProps, ExplorerFilterStateProps>(
  (state, { perspective }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const dateRange = getDateRangeDefault(queryFromRoute);

    // Omitting key_only to share a single request -- the toolbar needs key values
    const orgQueryString = getQuery({
      // TBD...
    });

    let orgReport;
    let orgReportFetchStatus;
    const orgReportPathsType = getOrgReportPathsType(perspective);
    if (orgReportPathsType) {
      orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, orgQueryString);
      orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(
        state,
        orgReportPathsType,
        orgReportType,
        orgQueryString
      );
    }

    // Fetch tags with largest date range available
    const { start_date, end_date } = getLast60DaysDate();

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      start_date,
      end_date,
      // key_only: true
    });
    let tagReport;
    let tagReportFetchStatus;
    const tagReportPathsType = getTagReportPathsType(perspective);
    if (tagReportPathsType) {
      tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
      tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
        state,
        tagReportPathsType,
        tagReportType,
        tagQueryString
      );
    }

    return {
      dateRange,
      orgQueryString,
      orgReport,
      orgReportFetchStatus,
      orgReportPathsType,
      perspective,
      tagQueryString,
      tagReport,
      tagReportFetchStatus,
      tagReportPathsType,
    };
  }
);

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilterConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase);
const ExplorerFilter = withRouter(withTranslation()(ExplorerFilterConnect));

export { ExplorerFilter, ExplorerFilterProps };
