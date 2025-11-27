import type { Org, OrgPathsType } from '@koku-ui/api/orgs/org';
import { OrgType } from '@koku-ui/api/orgs/org';
import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Resource, ResourcePathsType } from '@koku-ui/api/resources/resource';
import { ResourceType } from '@koku-ui/api/resources/resource';
import type { Tag, TagPathsType } from '@koku-ui/api/tags/tag';
import { TagType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import { Title } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { FetchStatus } from '../../../store/common';
import { createMapStateToProps } from '../../../store/common';
import { orgActions, orgSelectors } from '../../../store/orgs';
import { resourceActions, resourceSelectors } from '../../../store/resources';
import { tagActions, tagSelectors } from '../../../store/tags';
import { awsCategoryKey, awsCategoryPrefix, orgUnitIdKey, tagKey, tagPrefix } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import type { PerspectiveType } from '../../explorer/explorerUtils';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectWrapper } from '../selectWrapper';
import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupBySelect } from './groupBySelect';

interface GroupByOwnProps extends RouterComponentProps, WrappedComponentProps {
  endDate?: string;
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onSelect(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgPathsType?: OrgPathsType;
  perspective?: PerspectiveType;
  resourcePathsType: ResourcePathsType;
  showCostCategories?: boolean;
  showOrgs?: boolean;
  showTags?: boolean;
  startDate?: string;
  tagPathsType: TagPathsType;
  timeScopeValue?: number;
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
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchResource?: typeof resourceActions.fetchResource;
  fetchTag?: typeof tagActions.fetchTag;
}

interface GroupByState {
  currentItem?: string;
  defaultItem?: string;
  isGroupByCostCategoryVisible?: boolean;
  isGroupByOrgVisible?: boolean;
  isGroupByTagVisible?: boolean;
}

type GroupByProps = GroupByOwnProps & GroupByStateProps & GroupByDispatchProps;

const groupByOrgOptions: {
  label: string;
  value: string;
}[] = [{ label: orgUnitIdKey, value: orgUnitIdKey }];

const groupByCostCategoryOptions: {
  label: string;
  value: string;
}[] = [{ label: awsCategoryKey, value: awsCategoryKey }];

const groupByTagOptions: {
  label: string;
  value: string;
}[] = [{ label: tagKey, value: tagKey }];

const orgType = OrgType.org;
const resourceType = ResourceType.aws_category;
const tagType = TagType.tag;

class GroupByBase extends React.Component<GroupByProps, GroupByState> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByCostCategoryVisible: false,
    isGroupByOrgVisible: false,
    isGroupByTagVisible: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleOnSelect = this.handleOnSelect.bind(this);
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
    const { endDate, groupBy, perspective, startDate, timeScopeValue } = this.props;

    if (
      prevProps.endDate !== endDate ||
      prevProps.groupBy !== groupBy ||
      prevProps.perspective !== perspective ||
      prevProps.startDate !== startDate ||
      prevProps.timeScopeValue !== timeScopeValue
    ) {
      let options;
      if (prevProps.perspective !== perspective) {
        options = {
          isGroupByCostCategoryVisible: false,
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        };
      }
      if (prevProps.timeScopeValue !== timeScopeValue && this.getCurrentGroupBy() !== tagKey) {
        options = {
          ...(options && options),
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
    if (!queryFromRoute?.group_by) {
      return defaultItem;
    }

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys = queryFromRoute?.group_by ? Object.keys(queryFromRoute.group_by) : [];

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
          isGroupByCostCategoryVisible: true,
        });
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : defaultItem;
  };

  private getGroupBy = () => {
    const { isDisabled } = this.props;
    const { currentItem } = this.state;

    const selectOptions = this.getGroupByOptions();
    const selection = selectOptions.find(option => option.value === currentItem);

    return (
      <SelectWrapper
        id="group-by-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        selection={selection}
      />
    );
  };

  private getGroupByOptions = (): SelectWrapperOption[] => {
    const { options, orgReport, resourceReport, tagReport, intl } = this.props;

    const allOptions = [...options];
    if (orgReport?.data?.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport?.data?.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    if (resourceReport?.data?.length > 0) {
      allOptions.push(...groupByCostCategoryOptions);
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

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelect } = this.props;

    if (selection.value === orgUnitIdKey || selection.value === awsCategoryKey || selection.value === tagKey) {
      this.setState({
        currentItem: selection.value,
        isGroupByCostCategoryVisible: selection.value === awsCategoryKey,
        isGroupByOrgVisible: selection.value === orgUnitIdKey,
        isGroupByTagVisible: selection.value === tagKey,
      });
    } else {
      this.setState(
        {
          currentItem: selection.value,
          isGroupByCostCategoryVisible: false,
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        },
        () => {
          if (onSelect) {
            onSelect(selection.value);
          }
        }
      );
    }
  };

  private updateReport = () => {
    const {
      fetchOrg,
      fetchResource,
      fetchTag,
      orgPathsType,
      orgQueryString,
      showCostCategories,
      showOrgs,
      showTags,
      resourcePathsType,
      resourceQueryString,
      tagPathsType,
      tagQueryString,
    } = this.props;

    if (showCostCategories) {
      fetchResource(resourcePathsType, resourceType, resourceQueryString);
    }
    if (showOrgs) {
      fetchOrg(orgPathsType, orgType, orgQueryString);
    }
    if (showTags) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  };

  public render() {
    const {
      getIdKeyForGroupBy,
      groupBy,
      intl,
      isDisabled = false,
      onSelect,
      orgReport,
      resourceReport,
      tagReport,
    } = this.props;
    const { isGroupByOrgVisible, isGroupByCostCategoryVisible, isGroupByTagVisible } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Title headingLevel="h3" size="md" style={styles.groupBySelectorLabel}>
          {intl.formatMessage(messages.groupByLabel)}
        </Title>
        {this.getGroupBy()}
        {isGroupByOrgVisible && (
          <GroupByOrg
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelect={onSelect}
            orgReport={orgReport}
          />
        )}
        {isGroupByTagVisible && (
          <GroupBySelect groupBy={groupBy} isDisabled={isDisabled} onSelect={onSelect} report={tagReport} />
        )}
        {isGroupByCostCategoryVisible && (
          <GroupBySelect
            groupBy={groupBy}
            isCostCategory
            isDisabled={isDisabled}
            onSelect={onSelect}
            report={resourceReport}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>(
  (state, { endDate, orgPathsType, resourcePathsType, startDate, tagPathsType, timeScopeValue = -1 }) => {
    // Use start and end dates with Cost Explorer, default to current month filter for details pages
    const tagFilter =
      startDate && endDate
        ? {
            end_date: endDate,
            start_date: startDate,
          }
        : {
            filter: {
              time_scope_value: timeScopeValue,
            },
          };

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const baseQuery = {
      ...tagFilter,
      key_only: true,
      limit: 1000,
    };

    const resourceQueryString = getQuery({
      key_only: true,
    });
    const resourceReport = resourceSelectors.selectResource(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );
    const resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );

    const tagQueryString = getQuery({
      ...baseQuery,
    });
    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

    const orgQueryString = getQuery({
      ...baseQuery,
    });
    const orgReport = orgSelectors.selectOrg(state, orgPathsType, orgType, orgQueryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);

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
