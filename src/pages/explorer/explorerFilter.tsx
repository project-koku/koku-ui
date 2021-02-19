import {ToolbarChipGroup} from '@patternfly/react-core';
import {Org, OrgPathsType, OrgType} from 'api/orgs/org';
import {getQuery, orgUnitIdKey, parseQuery, Query, tagKey} from 'api/queries/query';
import {Tag, TagPathsType, TagType} from 'api/tags/tag';
import {DataToolbar} from 'pages/details/components/dataToolbar/dataToolbar';
import React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {createMapStateToProps, FetchStatus} from 'store/common';
import {orgActions, orgSelectors} from 'store/orgs';
import {tagActions, tagSelectors} from 'store/tags';
import {isEqual} from 'utils/equal';

import {DateRange} from './dateRange';
import {styles} from './explorerFilter.styles';
import {
  dateRangeOptions,
  DateRangeType,
  getDateRangeDefault,
  getGroupByOptions,
  getOrgReportPathsType,
  getPerspectiveDefault,
  getRouteForQuery,
  getTagReportPathsType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerFilterOwnProps {
  groupBy: string;
  isDisabled?: boolean;
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: Query;
  queryString?: string;
}

interface ExplorerFilterStateProps {
  dateRange: DateRangeType;
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgReportPathsType?: OrgPathsType;
  perspective: PerspectiveType;
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
    const { fetchOrg, fetchTag, orgReportPathsType, queryString, tagReportPathsType } = this.props;

    if (orgReportPathsType) {
      fetchOrg(orgReportPathsType, orgReportType, queryString);
    }
    if (tagReportPathsType) {
      fetchTag(tagReportPathsType, tagReportType, queryString);
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
      groupBy,
      orgReport,
      orgReportPathsType,
      perspective,
      query,
      queryString,
      tagReport,
      tagReportPathsType,
    } = this.props;

    if (query && !isEqual(query, prevProps.query)) {
      if (orgReportPathsType) {
        fetchOrg(orgReportPathsType, orgReportType, queryString);
      }
      if (tagReportPathsType) {
        fetchTag(tagReportPathsType, tagReportType, queryString);
      }
    }
    if (!isEqual(orgReport, prevProps.orgReport) || !isEqual(tagReport, prevProps.tagReport)) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
      });
    }
    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
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
    const { groupBy, isDisabled, onFilterAdded, onFilterRemoved, orgReport, query, tagReport } = this.props;
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
        style={styles.toolbarContainer}
        showFilter
        tagReport={tagReport}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerFilterOwnProps, ExplorerFilterStateProps>((state, props) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute);
  const dateRange = getDateRangeDefault(queryFromRoute);

  // Omitting key_only to share a single request -- the toolbar needs key values
  const queryString = getQuery({
    // key_only: true
  });

  let orgReport;
  let orgReportFetchStatus;
  const orgReportPathsType = getOrgReportPathsType(perspective);
  if (orgReportPathsType) {
    orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, queryString);
    orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgReportPathsType, orgReportType, queryString);
  }

  let tagReport;
  let tagReportFetchStatus;
  const tagReportPathsType = getTagReportPathsType(perspective);
  if (tagReportPathsType) {
    tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
    tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagReportPathsType, tagReportType, queryString);
  }

  return {
    dateRange,
    orgReport,
    orgReportFetchStatus,
    orgReportPathsType,
    perspective,
    queryString,
    tagReport,
    tagReportFetchStatus,
    tagReportPathsType,
  };
});

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilter = withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase)));

export { ExplorerFilter, ExplorerFilterProps };
