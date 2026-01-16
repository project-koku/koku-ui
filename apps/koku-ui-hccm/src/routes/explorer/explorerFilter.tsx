import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { Org, OrgPathsType } from 'api/orgs/org';
import { OrgType } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { ResourceType } from 'api/resources/resource';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/components/dataToolbar';
import { DateRange } from 'routes/components/dateRange';
import { DateRangeType, getDateRangeById } from 'routes/utils/dateRange';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import { getRouteForQuery } from 'routes/utils/query';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { resourceActions, resourceSelectors } from 'store/resources';
import { tagActions, tagSelectors } from 'store/tags';
import { formatStartEndDate } from 'utils/dates';
import { awsCategoryKey, orgUnitIdKey, tagKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { ExplorerDatePicker } from './explorerDatePicker';
import { styles } from './explorerFilter.styles';
import {
  getGroupByOptions,
  getOrgReportPathsType,
  getResourcePathsType,
  getTagReportPathsType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerFilterOwnProps extends RouterComponentProps, WrappedComponentProps {
  dateRangeType: DateRangeType;
  endDate?: string;
  groupBy: string;
  isCurrentMonthData?: boolean;
  isDataAvailable?: boolean;
  isPreviousMonthData?: boolean;
  isDisabled?: boolean;
  onDateRangeSelect(value: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  perspective: PerspectiveType;
  pagination?: React.ReactNode;
  query?: Query;
  startDate?: string;
}

interface ExplorerFilterStateProps {
  orgPathsType?: OrgPathsType;
  orgQueryString?: string;
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  resourcePathsType?: ResourcePathsType;
  resourceQueryString?: string;
  resourceReport?: Resource;
  resourceReportFetchStatus?: FetchStatus;
  tagPathsType?: TagPathsType;
  tagQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface ExplorerFilterDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchResource?: typeof resourceActions.fetchResource;
  fetchTag?: typeof tagActions.fetchTag;
}

interface ExplorerFilterState {
  categoryOptions?: ToolbarLabelGroup[];
  showDatePicker?: boolean;
}

type ExplorerFilterProps = ExplorerFilterOwnProps & ExplorerFilterStateProps & ExplorerFilterDispatchProps;

const orgType = OrgType.org;
const resourceType = ResourceType.aws_category;
const tagType = TagType.tag;

export class ExplorerFilterBase extends React.Component<ExplorerFilterProps, ExplorerFilterState> {
  protected defaultState: ExplorerFilterState = {
    showDatePicker: false,
  };
  public state: ExplorerFilterState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
    this.setState({
      categoryOptions: this.getCategoryOptions(),
      showDatePicker: this.props.dateRangeType === DateRangeType.custom,
    });
  }

  public componentDidUpdate(prevProps: ExplorerFilterProps) {
    const { dateRangeType, orgQueryString, orgReport, query, resourceQueryString, tagQueryString, tagReport } =
      this.props;

    if (
      prevProps.dateRangeType !== dateRangeType ||
      !isEqual(orgReport, prevProps.orgReport) ||
      !isEqual(tagReport, prevProps.tagReport)
    ) {
      this.setState({
        categoryOptions: this.getCategoryOptions(),
        showDatePicker: dateRangeType === DateRangeType.custom,
      });
    }
    if (
      (orgQueryString && !isEqual(orgQueryString, prevProps.orgQueryString)) ||
      (query && !isEqual(query, prevProps.query)) ||
      (resourceQueryString && !isEqual(resourceQueryString, prevProps.resourceQueryString)) ||
      (tagQueryString && !isEqual(tagQueryString, prevProps.tagQueryString))
    ) {
      this.updateReport();
    }
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { orgReport, perspective, intl, resourceReport, tagReport } = this.props;

    const options = [];
    const groupByOptions = getGroupByOptions(perspective);
    groupByOptions.map(option => {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: option.label }),
        key: option.value,
        resourceKey: option.resourceKey,
      });
    });
    if (orgReport?.data?.length > 0) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
        key: orgUnitIdKey,
      });
    }
    if (resourceReport?.data?.length > 0) {
      options.push({
        name: intl.formatMessage(messages.filterByValues, { value: awsCategoryKey }),
        key: awsCategoryKey,
      });
    }
    if (tagReport?.data?.length > 0) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: tagKey }), key: tagKey });
    }
    return options.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  private getDateRangeComponent = () => {
    const { dateRangeType, isCurrentMonthData, isDataAvailable, isPreviousMonthData, isDisabled } = this.props;

    return (
      <DateRange
        dateRangeType={dateRangeType}
        isCurrentMonthData={isCurrentMonthData}
        isDataAvailable={isDataAvailable}
        isDisabled={isDisabled}
        isExplorer
        isPreviousMonthData={isPreviousMonthData}
        onSelect={this.handleOnDateRangeSelect}
      />
    );
  };

  private getDatePickerComponent = () => {
    const { dateRangeType, endDate, startDate } = this.props;
    const { showDatePicker } = this.state;

    return showDatePicker ? (
      <ExplorerDatePicker
        dateRangeType={dateRangeType}
        endDate={endDate}
        onSelect={this.handleOnDatePickerSelect}
        startDate={startDate}
      />
    ) : null;
  };

  private handleOnDatePickerSelect = (startDate: Date, endDate: Date) => {
    const { query, router } = this.props;

    const { start_date, end_date } = formatStartEndDate(startDate, endDate);

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      dateRangeType: DateRangeType.custom,
      start_date,
      end_date,
    };
    router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
  };

  private handleOnDateRangeSelect = (value: string) => {
    const { onDateRangeSelect } = this.props;

    const currentDateRange = getDateRangeById(value);
    const showDatePicker = value === DateRangeType.custom;
    this.setState({ showDatePicker }, () => {
      if (onDateRangeSelect && !showDatePicker) {
        onDateRangeSelect(currentDateRange);
      }
    });
  };

  private updateReport = () => {
    const {
      fetchOrg,
      fetchResource,
      fetchTag,
      orgQueryString,
      orgPathsType,
      perspective,
      resourcePathsType,
      resourceQueryString,
      tagQueryString,
      tagPathsType,
    } = this.props;

    if (orgPathsType) {
      fetchOrg(orgPathsType, orgType, orgQueryString);
    }
    if (resourcePathsType && (perspective === PerspectiveType.aws || perspective === PerspectiveType.awsOcp)) {
      fetchResource(resourcePathsType, resourceType, resourceQueryString);
    }
    if (tagPathsType) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  };

  public render() {
    const {
      endDate,
      groupBy,
      isDisabled,
      onFilterAdded,
      onFilterRemoved,
      orgReport,
      query,
      resourcePathsType,
      resourceReport,
      startDate,
      tagPathsType,
      tagReport,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        datePicker={this.getDatePickerComponent()}
        dateRange={this.getDateRangeComponent()}
        endDate={endDate}
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        orgReport={orgReport}
        query={query}
        resourceReport={resourceReport}
        resourcePathsType={resourcePathsType}
        startDate={startDate}
        style={styles.toolbarContainer}
        showCriteria
        showFilter
        tagReport={tagReport}
        tagPathsType={tagPathsType}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<ExplorerFilterOwnProps, ExplorerFilterStateProps>(
  (state, { endDate, perspective, startDate }) => {
    // Omitting key_only to share a single request -- the toolbar needs key values
    const orgQueryString = getQuery({
      end_date: endDate,
      start_date: startDate,
      limit: 1000,
    });

    let orgReport;
    let orgReportFetchStatus;
    const orgPathsType = getOrgReportPathsType(perspective);
    if (orgPathsType) {
      orgReport = orgSelectors.selectOrg(state, orgPathsType, orgType, orgQueryString);
      orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);
    }

    // AWS cost categories
    const resourceQueryString = getQuery({
      key_only: true,
    });
    let resourceReport;
    let resourceReportFetchStatus;
    const resourcePathsType = getResourcePathsType(perspective);
    if (resourcePathsType) {
      resourceReport = resourceSelectors.selectResource(state, resourcePathsType, resourceType, resourceQueryString);
      resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
        state,
        resourcePathsType,
        resourceType,
        resourceQueryString
      );
    }

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const tagQueryString = getQuery({
      end_date: endDate,
      start_date: startDate,
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
      orgPathsType,
      orgQueryString,
      orgReport,
      orgReportFetchStatus,
      resourcePathsType,
      resourceQueryString,
      resourceReport,
      resourceReportFetchStatus,
      tagPathsType,
      tagQueryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: ExplorerFilterDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchResource: resourceActions.fetchResource,
  fetchTag: tagActions.fetchTag,
};

const ExplorerFilterConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerFilterBase);
const ExplorerFilter = injectIntl(withRouter(ExplorerFilterConnect));

export { ExplorerFilter };
export type { ExplorerFilterProps };
