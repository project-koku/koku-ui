import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { Tag } from 'api/tags/tag';
import messages from 'locales/messages';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';

interface GroupByTagOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  tagReport: Tag;
}

interface GroupByTagState {
  currentItem?: string;
  isGroupByOpen: boolean;
}

type GroupByTagProps = GroupByTagOwnProps;

class GroupByTagBase extends React.Component<GroupByTagProps> {
  protected defaultState: GroupByTagState = {
    isGroupByOpen: false,
  };
  public state: GroupByTagState = { ...this.defaultState };

  constructor(props: GroupByTagProps) {
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

  public componentDidUpdate(prevProps: GroupByTagProps) {
    const { groupBy } = this.props;
    if (prevProps.groupBy !== groupBy) {
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  private getGroupByItems = () => {
    const { tagReport } = this.props;

    if (!(tagReport && tagReport.data)) {
      return [];
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of tagReport.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    let data = [];
    if (hasTagKeys) {
      const keepData = tagReport.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(tagReport.data);
    }

    return data.map((item, index) => {
      const tagKey = hasTagKeys ? item.key : item;
      return <SelectOption key={`${tagKey}:${index}`} value={tagKey} />;
    });
  };

  private getCurrentGroupBy = () => {
    const { router } = this.props;
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    let groupBy: string;
    for (const key of groupByKeys) {
      const index = key.indexOf(tagPrefix);
      if (index !== -1) {
        groupBy = key.slice(tagPrefix.length);
        break;
      }
    }
    return groupBy;
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
      onSelected(`${tagPrefix}${selection}`);
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

const GroupByTag = injectIntl(withRouter(GroupByTagBase));

export { GroupByTag };
export type { GroupByTagProps };
