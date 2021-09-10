import { Dropdown, DropdownItem, DropdownToggle, Title } from '@patternfly/react-core';
import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagKey, tagPrefix } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import { PerspectiveType } from 'pages/views/explorer/explorerUtils';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { tagActions, tagSelectors } from 'store/tags';

import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupByTag } from './groupByTag';

interface GroupByOwnProps extends WrappedComponentProps {
  endDate?: string;
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgQueryString?: string;
  orgReportPathsType?: OrgPathsType;
  perspective?: PerspectiveType;
  showOrgs?: boolean;
  showTags?: boolean;
  startDate?: string;
  tagQueryString?: string;
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
    this.handleGroupByClick = this.handleGroupByClick.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    const {
      fetchOrg,
      fetchTag,
      orgQueryString,
      orgReportPathsType,
      showOrgs,
      showTags,
      tagQueryString,
      tagReportPathsType,
    } = this.props;
    if (showOrgs) {
      fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
    }
    if (showTags) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const {
      fetchOrg,
      fetchTag,
      groupBy,
      orgQueryString,
      orgReportPathsType,
      perspective,
      showOrgs,
      showTags,
      tagQueryString,
      tagReportPathsType,
    } = this.props;
    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
      if (showOrgs) {
        fetchOrg(orgReportPathsType, orgReportType, orgQueryString);
      }
      if (showTags) {
        fetchTag(tagReportPathsType, tagReportType, tagQueryString);
      }

      let options;
      if (prevProps.perspective !== perspective) {
        options = {
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        };
      }
      this.setState({ currentItem: this.getCurrentGroupBy(), ...(options ? options : {}) });
    }
  }

  public handleGroupByClick = value => {
    const { onItemClicked } = this.props;

    if (value === orgUnitIdKey || value === tagKey) {
      this.setState({
        currentItem: value,
        isGroupByOrgVisible: value === orgUnitIdKey,
        isGroupByTagVisible: value === tagKey,
      });
    } else {
      this.setState({
        currentItem: value,
        isGroupByOrgVisible: false,
        isGroupByTagVisible: false,
      });
      if (onItemClicked) {
        onItemClicked(value);
      }
    }
  };

  private getGroupByItems = () => {
    const { options, orgReport, tagReport, intl } = this.props;

    const allOptions = [...options];
    if (orgReport && orgReport.data && orgReport.data.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport && tagReport.data && tagReport.data.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    return allOptions.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleGroupByClick(option.value)}>
        {intl.formatMessage(messages.GroupByValuesTitleCase, { value: option.label, count: 1 })}
      </DropdownItem>
    ));
  };

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

  private handleGroupBySelect = () => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  public render() {
    const { getIdKeyForGroupBy, groupBy, isDisabled = false, onItemClicked, orgReport, intl, tagReport } = this.props;
    const { currentItem, isGroupByOpen, isGroupByOrgVisible, isGroupByTagVisible } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Title headingLevel="h3" size="md" style={styles.groupBySelectorLabel}>
          {intl.formatMessage(messages.GroupByLabel)}
        </Title>
        <Dropdown
          onSelect={this.handleGroupBySelect}
          toggle={
            <DropdownToggle isDisabled={isDisabled} onToggle={this.handleGroupByToggle}>
              {intl.formatMessage(messages.GroupByValuesTitleCase, { value: currentItem, count: 1 })}
            </DropdownToggle>
          }
          isOpen={isGroupByOpen}
          dropdownItems={[this.getGroupByItems()]}
        />
        {Boolean(isGroupByOrgVisible) && (
          <GroupByOrg
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={isDisabled}
            onItemClicked={onItemClicked}
            options={groupByOrgOptions}
            orgReport={orgReport}
          />
        )}
        {Boolean(isGroupByTagVisible) && (
          <GroupByTag
            groupBy={groupBy}
            isDisabled={isDisabled}
            onItemClicked={onItemClicked}
            options={groupByTagOptions}
            tagReport={tagReport}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>(
  (state, { endDate, startDate, orgReportPathsType, tagReportPathsType }) => {
    const tagQuery =
      endDate && startDate
        ? {
            start_date: startDate,
            end_date: endDate,
          }
        : {
            filter: {
              resolution: 'monthly',
              time_scope_units: 'month',
              time_scope_value: -1,
            },
          };

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      ...tagQuery,
      // key_only: true
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      tagQueryString
    );

    const orgQueryString = getQuery({
      // TBD...
    });
    const orgReport = orgSelectors.selectOrg(state, orgReportPathsType, orgReportType, orgQueryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(
      state,
      orgReportPathsType,
      orgReportType,
      orgQueryString
    );

    return {
      orgQueryString,
      orgReport,
      orgReportFetchStatus,
      tagQueryString,
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

export { GroupBy, GroupByProps };
