import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { Org } from 'api/orgs/org';
import { orgUnitIdKey, orgUnitNameKey, parseQuery, Query } from 'api/queries/query';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { styles } from './groupBy.styles';

interface GroupByOrgOwnProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgReport: Org;
}

interface GroupByOrgState {
  currentItem?: string;
  defaultItem: string;
  isGroupByOpen: boolean;
}

interface GroupByOrgOption extends SelectOptionObject {
  id?: string;
}

type GroupByOrgProps = GroupByOrgOwnProps & WithTranslation;

class GroupByOrgBase extends React.Component<GroupByOrgProps> {
  protected defaultState: GroupByOrgState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
  };
  public state: GroupByOrgState = { ...this.defaultState };

  constructor(props: GroupByOrgProps) {
    super(props);
    this.handleGroupByClear = this.handleGroupByClear.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByOrgProps) {
    const { groupBy } = this.props;
    if (prevProps.groupBy !== groupBy) {
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  private getCurrentGroupBy = () => {
    const { getIdKeyForGroupBy } = this.props;

    const queryFromRoute = parseQuery<Query>(location.search);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    for (const key of groupByKeys) {
      const index = key.indexOf(orgUnitIdKey);
      if (index !== -1) {
        groupBy = queryFromRoute.group_by[orgUnitIdKey];
        break;
      }
    }
    return groupBy;
  };

  private getGroupByItems = () => {
    const { orgReport } = this.props;

    if (!(orgReport && orgReport.data)) {
      return [];
    }

    // Sort all names first
    const sortedData = orgReport.data.sort((a, b) => {
      if (a[orgUnitNameKey] < b[orgUnitNameKey]) {
        return -1;
      }
      if (a[orgUnitNameKey] > b[orgUnitNameKey]) {
        return 1;
      }
      return 0;
    });

    // Move roots first
    const roots = sortedData.filter(org => org.level === 0);

    const filteredOrgs = sortedData.filter(org => org.level !== 0);
    roots.map(root => {
      const item = sortedData.find(org => org[orgUnitIdKey] === root[orgUnitIdKey]);
      filteredOrgs.unshift(item);
    });

    return filteredOrgs.map(org => ({
      id: org[orgUnitIdKey],
      toString: () => org[orgUnitNameKey],
    }));
  };

  private handleGroupByClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleGroupBySelect = (event, selection: GroupByOrgOption) => {
    const { onItemClicked } = this.props;

    this.setState({
      currentItem: selection.id,
      isGroupByOpen: false,
    });
    if (onItemClicked) {
      onItemClicked(`${orgUnitIdKey}${selection.id}`);
    }
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({ isGroupByOpen });
  };

  public render() {
    const { isDisabled = false, t } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const groupByItems = this.getGroupByItems();
    const selection = groupByItems.find((item: GroupByOrgOption) => item.id === currentItem);

    return (
      <div style={styles.groupBySelector}>
        <Select
          aria-label={t('group_by.org_unit_aria_label')}
          isDisabled={isDisabled}
          onClear={this.handleGroupByClear}
          onToggle={this.handleGroupByToggle}
          onSelect={this.handleGroupBySelect}
          isOpen={isGroupByOpen}
          placeholderText={t('group_by.org_unit_placeholder')}
          selections={selection}
          variant={SelectVariant.typeahead}
        >
          {groupByItems.map(item => (
            <SelectOption description={item.id} key={item.id} value={item} />
          ))}
        </Select>
      </div>
    );
  }
}

const GroupByOrg = withTranslation()(GroupByOrgBase);

export { GroupByOrg, GroupByOrgProps };
