import type { Org } from '@koku-ui/api/orgs/org';
import type { Query } from '@koku-ui/api/queries/query';
import { parseQuery } from '@koku-ui/api/queries/query';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { orgUnitIdKey, orgUnitNameKey } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectTypeaheadWrapper } from '../selectWrapper';
import { styles } from './groupBy.styles';

interface GroupByOrgOwnProps extends RouterComponentProps, WrappedComponentProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onSelect(value: string);
  orgReport: Org;
}

interface GroupByOrgState {
  currentItem?: string;
}

type GroupByOrgProps = GroupByOrgOwnProps;

class GroupByOrgBase extends React.Component<GroupByOrgProps, GroupByOrgState> {
  protected defaultState: GroupByOrgState = {
    // TBD...
  };
  public state: GroupByOrgState = { ...this.defaultState };

  constructor(props: GroupByOrgProps) {
    super(props);
    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
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

  private getGroupByItems = (): SelectWrapperOption[] => {
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
      description: org[orgUnitIdKey],
      toString: () => org[orgUnitNameKey],
      value: org[orgUnitIdKey],
    }));
  };

  private handleOnClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelect } = this.props;

    this.setState({
      currentItem: selection.value,
    });
    if (onSelect) {
      onSelect(`${orgUnitIdKey}${selection.value}`);
    }
  };

  public render() {
    const { isDisabled = false, intl } = this.props;
    const { currentItem } = this.state;

    const selectOptions = this.getGroupByItems();
    const selection = selectOptions.find(option => option.value === currentItem);

    return (
      <div style={styles.groupBySelector}>
        <SelectTypeaheadWrapper
          aria-label={intl.formatMessage(messages.filterByOrgUnitAriaLabel)}
          id="group-by-org-select"
          isDisabled={isDisabled}
          onClear={this.handleOnClear}
          onSelect={this.handleOnSelect}
          options={selectOptions}
          placeholder={intl.formatMessage(messages.filterByOrgUnitPlaceholder)}
          selection={selection}
        />
      </div>
    );
  }
}

const GroupByOrg = injectIntl(withRouter(GroupByOrgBase));

export { GroupByOrg };
