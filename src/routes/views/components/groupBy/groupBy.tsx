import type { SelectOptionObject } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant, Title } from '@patternfly/react-core';
import type { Org, OrgPathsType } from 'api/orgs/org';
import { OrgType } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { ResourceType } from 'api/resources/resource';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { PerspectiveType } from 'routes/views/explorer/explorerUtils';
import { getDateRangeFromQuery } from 'routes/views/utils/dateRange';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { resourceActions, resourceSelectors } from 'store/resources';
import { tagActions, tagSelectors } from 'store/tags';
import { awsCategoryKey, awsCategoryPrefix, orgUnitIdKey, tagKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupByResource } from './groupByResource';
import { GroupByTag } from './groupByTag';

interface GroupByOwnProps extends RouterComponentProps, WrappedComponentProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgReportPathsType?: OrgPathsType;
  perspective?: PerspectiveType;
  resourceReportPathsType: ResourcePathsType;
  showAwsCategories?: boolean;
  showOrgs?: boolean;
  showTags?: boolean;
  tagReportPathsType: TagPathsType;
}

interface GroupByStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgQueryString?: string;
  resourceReport?: Resource;
  resourceReportFetchStatus?: FetchStatus;
  resourceQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface GroupByDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface GroupByState {
  currentItem?: string;
  defaultItem?: string;
  isGroupByOpen?: boolean;
  isGroupByOrgVisible?: boolean;
  isGroupByResourceVisible?: boolean;
  isGroupByTagVisible?: boolean;
}

interface GroupByOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type GroupByProps = GroupByOwnProps & GroupByStateProps & GroupByDispatchProps;

const groupByOrgOptions: {
  label: string;
  value: string;
}[] = [{ label: orgUnitIdKey, value: orgUnitIdKey }];

const groupByResourceOptions: {
  label: string;
  value: string;
}[] = [{ label: awsCategoryKey, value: awsCategoryKey }];

const groupByTagOptions: {
  label: string;
  value: string;
}[] = [{ label: tagKey, value: tagKey }];

const orgReportType = OrgType.org;
const resourceReportType = ResourceType.category;
const tagReportType = TagType.tag;

class GroupByBase extends React.Component<GroupByProps, GroupByState> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
    isGroupByOrgVisible: false,
    isGroupByResourceVisible: false,
    isGroupByTagVisible: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupBySelected = this.handleGroupBySelected.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    this.setState(
      {
        currentItem: this.getCurrentGroupBy(),
      },
      () => {
        this.updateReport();
      }
    );
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const { groupBy, perspective } = this.props;
    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
      let options;
      if (prevProps.perspective !== perspective) {
        options = {
          isGroupByOrgVisible: false,
          isGroupByResourceVisible: false,
          isGroupByTagVisible: false,
        };
      }
      this.setState({ currentItem: this.getCurrentGroupBy(), ...(options ? options : {}) }, () => {
        this.updateReport();
      });
    }
  }

  private getCurrentGroupBy = () => {
    const { getIdKeyForGroupBy, router } = this.props;
    const { defaultItem } = this.state;

    const queryFromRoute = parseQuery<Query>(router.location.search);
    if (!(queryFromRoute && queryFromRoute.group_by)) {
      return defaultItem;
    }

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    for (const key of groupByKeys) {
      let index = key.indexOf(tagPrefix);
      if (index !== -1) {
        groupBy = tagKey;
        this.setState({
          isGroupByTagVisible: true,
        });
        break;
      }
      index = key.indexOf(orgUnitIdKey);
      if (index !== -1) {
        groupBy = orgUnitIdKey;
        this.setState({
          isGroupByOrgVisible: true,
        });
        break;
      }
      index = key.indexOf(awsCategoryPrefix);
      if (index !== -1) {
        groupBy = awsCategoryKey;
        this.setState({
          isGroupByResourceVisible: true,
        });
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : defaultItem;
  };

  private getGroupBy = () => {
    const { isDisabled } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const selectOptions = this.getGroupByOptions();
    const selection = selectOptions.find((option: GroupByOption) => option.value === currentItem);

    return (
      <Select
        id="groupBySelect"
        isDisabled={isDisabled}
        isOpen={isGroupByOpen}
        onSelect={this.handleGroupBySelected}
        onToggle={this.handleGroupByToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getGroupByOptions = (): GroupByOption[] => {
    const { options, orgReport, resourceReport, tagReport, intl } = this.props;

    const allOptions = [...options];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    if (resourceReport && resourceReport.data && resourceReport.data.length > 0) {
      allOptions.push(...groupByResourceOptions);
    }
    return allOptions
      .map(option => ({
        toString: () => intl.formatMessage(messages.groupByValuesTitleCase, { value: option.label, count: 1 }),
        value: option.value,
      }))
      .sort((a, b) => {
        if (a.toString() < b.toString()) {
          return -1;
        }
        if (a.toString() > b.toString()) {
          return 1;
        }
        return 0;
      });
  };

  private handleGroupBySelected = (event, selection: GroupByOption) => {
    const { onSelected } = this.props;

    if (selection.value === orgUnitIdKey || selection.value === awsCategoryKey || selection.value === tagKey) {
      this.setState({
        currentItem: selection.value,
        isGroupByOpen: false,
        isGroupByOrgVisible: selection.value === orgUnitIdKey,
        isGroupByResourceVisible: selection.value === awsCategoryKey,
        isGroupByTagVisible: selection.value === tagKey,
      });
    } else {
      this.setState(
        {
          currentItem: selection.value,
          isGroupByOpen: false,
          isGroupByOrgVisible: false,
          isGroupByResourceVisible: false,
          isGroupByTagVisible: false,
        },
        () => {
          if (onSelected) {
            onSelected(selection.value);
          }
        }
      );
    }
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  private updateReport = () => {
    const {
      fetchOrg,
      fetchResource,
      fetchTag,
      orgReportPathsType,
      orgQueryString,
      showAwsCategories,
      showOrgs,
      showTags,
      resourceReportPathsType,
      resourceQueryString,
      tagReportPathsType,
      tagQueryString,
    } = this.props;

    if (showAwsCategories) {
      fetchResource(resourceReportPathsType, resourceReportType, resourceQueryString);
    }
    if (showOrgs) {
      fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
    }
    if (showTags) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  };

  public render() {
    const {
      getIdKeyForGroupBy,
      groupBy,
      intl,
      isDisabled = false,
      onSelected,
      orgReport,
      resourceReport,
      tagReport,
    } = this.props;
    const { isGroupByOrgVisible, isGroupByResourceVisible, isGroupByTagVisible } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Title headingLevel="h3" size="md" style={styles.groupBySelectorLabel}>
          {intl.formatMessage(messages.groupByLabel)}
        </Title>
        {this.getGroupBy()}
        {Boolean(isGroupByOrgVisible) && (
          <GroupByOrg
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByOrgOptions}
            orgReport={orgReport}
          />
        )}
        {Boolean(isGroupByTagVisible) && (
          <GroupByTag
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByTagOptions}
            tagReport={tagReport}
          />
        )}
        {Boolean(isGroupByResourceVisible) && (
          <GroupByResource
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByTagOptions}
            resourceReport={resourceReport}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>(
  (state, { orgReportPathsType, router, resourceReportPathsType, tagReportPathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    // Default to current month filter for details pages
    let tagFilter: any = {
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };

    // Replace with start and end dates for Cost Explorer
    if (queryFromRoute.dateRangeType) {
      const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

      tagFilter = {
        end_date,
        start_date,
      };
    }

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const baseQuery = {
      ...tagFilter,
      key_only: true,
      limit: 1000,
    };

    const resourceQueryString = getQuery({
      // ...baseQuery,
    });
    const resourceReport = resourceSelectors.selectResource(
      state,
      resourceReportPathsType,
      resourceReportType,
      resourceQueryString
    );
    const resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourceReportPathsType,
      resourceReportType,
      resourceQueryString
    );

    const tagQueryString = getQuery({
      ...baseQuery,
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      tagQueryString
    );

    const orgQueryString = getQuery({
      ...baseQuery,
    });
    const orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, orgQueryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(
      state,
      orgReportPathsType,
      orgReportType,
      orgQueryString
    );

    return {
      orgReport,
      orgReportFetchStatus,
      orgQueryString,
      resourceReport,
      resourceReportFetchStatus,
      resourceQueryString,
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: GroupByDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchResource: resourceActions.fetchResource,
  fetchTag: tagActions.fetchTag,
};

const GroupByConnect = connect(mapStateToProps, mapDispatchToProps)(GroupByBase);
const GroupBy = injectIntl(withRouter(GroupByConnect));

export default GroupBy;
