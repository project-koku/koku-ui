import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import type { Org } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { orgUnitIdKey, orgUnitNameKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';

interface GroupByOrgOwnProps extends RouterComponentProps, WrappedComponentProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgReport: Org;
}

interface GroupByOrgState {
  currentItem?: string;
  defaultItem?: string;
  isGroupByOpen?: boolean;
}

interface GroupByOrgOption extends SelectOptionObject {
  id?: string;
}

type GroupByOrgProps = GroupByOrgOwnProps;

class GroupByOrgBase extends React.Component<GroupByOrgProps, GroupByOrgState> {
  protected defaultState: GroupByOrgState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
  };
  public state: GroupByOrgState = { ...this.defaultState };

  constructor(props: GroupByOrgProps) {
    super(props);
    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
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
    const { getIdKeyForGroupBy, router } = this.props;

    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupByKeys = queryFromRoute?.group_by ? Object.keys(queryFromRoute.group_by) : [];

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

    if (!orgReport?.data) {
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

  private handleOnClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleOnSelect = (selection: GroupByOrgOption) => {
    const { onSelected } = this.props;

    this.setState({
      currentItem: selection.id,
      isGroupByOpen: false,
    });
    if (onSelected) {
      onSelected(`${orgUnitIdKey}${selection.id}`);
    }
  };

  private handleOnToggle = isGroupByOpen => {
    this.setState({ isGroupByOpen });
  };

  public render() {
    const { isDisabled = false, intl } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const groupByItems = this.getGroupByItems();
    const selection = groupByItems.find((item: GroupByOrgOption) => item.id === currentItem);

    return (
      <div style={styles.groupBySelector}>
        <Select
          aria-label={intl.formatMessage(messages.filterByOrgUnitAriaLabel)}
          isDisabled={isDisabled}
          onClear={this.handleOnClear}
          onSelect={(_evt, value) => this.handleOnSelect(value)}
          onToggle={(_evt, isExpanded) => this.handleOnToggle(isExpanded)}
          isOpen={isGroupByOpen}
          placeholderText={intl.formatMessage(messages.filterByOrgUnitPlaceholder)}
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

const GroupByOrg = injectIntl(withRouter(GroupByOrgBase));

export { GroupByOrg };
