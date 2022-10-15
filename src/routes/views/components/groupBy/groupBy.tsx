import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagKey, tagPrefix } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { PerspectiveType } from 'routes/views/explorer/explorerUtils';
import { getDateRange, getDateRangeDefault } from 'routes/views/utils/dateRange';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';

import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupByTag } from './groupByTag';

interface GroupByOwnProps extends WrappedComponentProps {
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
  queryString?: string;
  showOrgs?: boolean;
  showTags?: boolean;
  tagReportPathsType: TagPathsType;
}

interface GroupByStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchTag?: typeof tagActions.fetchTag;
}

interface GroupByState {
  currentItem?: string;
  defaultItem: string;
  isGroupByOpen: boolean;
  isGroupByOrgVisible: boolean;
  isGroupByTagVisible: boolean;
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

const groupByTagOptions: {
  label: string;
  value: string;
}[] = [{ label: tagKey, value: tagKey }];

const orgReportType = OrgType.org;
const tagReportType = TagType.tag;

class GroupByBase extends React.Component<GroupByProps> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
    isGroupByOrgVisible: false,
    isGroupByTagVisible: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupBySelected = this.handleGroupBySelected.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    const {
      fetchOrg,
      fetchTag,
      orgReportFetchStatus,
      orgReportPathsType,
      queryString,
      showOrgs,
      showTags,
      tagReportFetchStatus,
      tagReportPathsType,
    } = this.props;
    this.setState(
      {
        currentItem: this.getCurrentGroupBy(),
      },
      () => {
        if (showOrgs && orgReportFetchStatus !== FetchStatus.inProgress) {
          fetchOrg(orgReportPathsType, orgReportType, queryString);
        }
        if (showTags && tagReportFetchStatus !== FetchStatus.inProgress) {
          fetchTag(tagReportPathsType, tagReportType, queryString);
        }
      }
    );
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const {
      fetchOrg,
      fetchTag,
      groupBy,
      orgReportFetchStatus,
      orgReportPathsType,
      perspective,
      queryString,
      showOrgs,
      showTags,
      tagReportFetchStatus,
      tagReportPathsType,
    } = this.props;
    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
      let options;
      if (prevProps.perspective !== perspective) {
        options = {
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        };
      }
      this.setState({ currentItem: this.getCurrentGroupBy(), ...(options ? options : {}) }, () => {
        if (showOrgs && orgReportFetchStatus !== FetchStatus.inProgress) {
          fetchOrg(orgReportPathsType, orgReportType, queryString);
        }
        if (showTags && tagReportFetchStatus !== FetchStatus.inProgress) {
          fetchTag(tagReportPathsType, tagReportType, queryString);
        }
      });
    }
  }

  private getCurrentGroupBy = () => {
    const { getIdKeyForGroupBy } = this.props;
    const { defaultItem } = this.state;

    const queryFromRoute = parseQuery<Query>(location.search);
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
    const { options, orgReport, tagReport, intl } = this.props;

    const allOptions = [...options];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    return allOptions.map(option => ({
      toString: () => intl.formatMessage(messages.groupByValuesTitleCase, { value: option.label, count: 1 }),
      value: option.value,
    }));
  };

  private handleGroupBySelected = (event, selection: GroupByOption) => {
    const { onSelected } = this.props;

    if (selection.value === orgUnitIdKey || selection.value === tagKey) {
      this.setState({
        currentItem: selection.value,
        isGroupByOpen: false,
        isGroupByOrgVisible: selection.value === orgUnitIdKey,
        isGroupByTagVisible: selection.value === tagKey,
      });
    } else {
      this.setState(
        {
          currentItem: selection.value,
          isGroupByOpen: false,
          isGroupByOrgVisible: false,
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

  public render() {
    const { getIdKeyForGroupBy, groupBy, isDisabled = false, onSelected, orgReport, intl, tagReport } = this.props;
    const { isGroupByOrgVisible, isGroupByTagVisible } = this.state;

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
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>(
  (state, { orgReportPathsType, tagReportPathsType }) => {
    const queryFromRoute = parseQuery<Query>(location.search);

    // Default to current month filter for details pages
    let tagFilter: any = {
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };

    // Replace with start and end dates for Cost Explorer
    if (queryFromRoute.dateRange) {
      const dateRange = getDateRangeDefault(queryFromRoute);
      const { end_date, start_date } = getDateRange(dateRange);

      tagFilter = {
        end_date,
        start_date,
      };
    }

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const queryString = getQuery({
      ...tagFilter,
      key_only: true,
      limit: 1000,
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, queryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      queryString
    );

    const orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, queryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(
      state,
      orgReportPathsType,
      orgReportType,
      queryString
    );

    return {
      orgReport,
      orgReportFetchStatus,
      queryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: GroupByDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchTag: tagActions.fetchTag,
};

const GroupByConnect = connect(mapStateToProps, mapDispatchToProps)(GroupByBase);
const GroupBy = injectIntl(GroupByConnect);

export default GroupBy;
