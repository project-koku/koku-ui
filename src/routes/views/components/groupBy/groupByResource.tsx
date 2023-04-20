import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { Resource } from 'api/resources/resource';
import messages from 'locales/messages';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { awsCategoryPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';

interface GroupByResourceOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  resourceReport: Resource;
}

interface GroupByResourceState {
  currentItem?: string;
  isGroupByOpen?: boolean;
}

type GroupByResourceProps = GroupByResourceOwnProps;

class GroupByResourceBase extends React.Component<GroupByResourceProps, GroupByResourceState> {
  protected defaultState: GroupByResourceState = {
    isGroupByOpen: false,
  };
  public state: GroupByResourceState = { ...this.defaultState };

  constructor(props: GroupByResourceProps) {
    super(props);
    this.handleGroupByClear = this.handleGroupByClear.bind(this);
    this.handleGroupBySelected = this.handleGroupBySelected.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByResourceProps) {
    const { groupBy } = this.props;
    if (prevProps.groupBy !== groupBy) {
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  private getCurrentGroupBy = () => {
    const { router } = this.props;
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    let groupBy: string;
    for (const key of groupByKeys) {
      const index = key.indexOf(awsCategoryPrefix);
      if (index !== -1) {
        groupBy = key.slice(awsCategoryPrefix.length);
        break;
      }
    }
    return groupBy;
  };

  private getGroupByItems = () => {
    const { resourceReport } = this.props;

    if (!(resourceReport && resourceReport.data)) {
      return [];
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of resourceReport.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    let data = [];
    if (hasTagKeys) {
      const keepData = resourceReport.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(resourceReport.data);
    }

    return data.map((item, index) => {
      const tagKey = hasTagKeys ? item.key : item;
      return <SelectOption key={`${tagKey}:${index}`} value={tagKey} />;
    });
  };

  private handleGroupByClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleGroupBySelected = (event, selection) => {
    const { onSelected } = this.props;

    this.setState({
      currentItem: selection,
      isGroupByOpen: false,
    });
    if (onSelected) {
      onSelected(`${awsCategoryPrefix}${selection}`);
    }
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({ isGroupByOpen });
  };

  public render() {
    const { isDisabled, intl } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Select
          aria-label={intl.formatMessage(messages.filterByTagKeyAriaLabel)}
          isDisabled={isDisabled}
          onClear={this.handleGroupByClear}
          onToggle={this.handleGroupByToggle}
          onSelect={this.handleGroupBySelected}
          isOpen={isGroupByOpen}
          placeholderText={intl.formatMessage(messages.filterByTagKeyPlaceholder)}
          selections={currentItem}
          variant={SelectVariant.typeahead}
        >
          {this.getGroupByItems()}
        </Select>
      </div>
    );
  }
}

const GroupByResource = injectIntl(withRouter(GroupByResourceBase));

export { GroupByResource };
