import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { Resource } from 'api/resources/resource';
import type { Tag } from 'api/tags/tag';
import messages from 'locales/messages';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { tagPrefix } from 'utils/props';
import { awsCategoryPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';

interface GroupBySelectOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy?: string;
  isCostCategory?: boolean;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  report: Resource | Tag;
}

interface GroupBySelectState {
  currentItem?: string;
  isGroupByOpen?: boolean;
  prefix?: string;
}

type GroupBySelectProps = GroupBySelectOwnProps;

class GroupBySelectBase extends React.Component<GroupBySelectProps, GroupBySelectState> {
  protected defaultState: GroupBySelectState = {
    isGroupByOpen: false,
    prefix: this.props.isCostCategory ? awsCategoryPrefix : tagPrefix,
  };
  public state: GroupBySelectState = { ...this.defaultState };

  constructor(props: GroupBySelectProps) {
    super(props);
    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnSelected = this.handleOnSelected.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
  }

  public componentDidMount() {
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupBySelectProps) {
    const { groupBy } = this.props;
    if (prevProps.groupBy !== groupBy) {
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  private getCurrentGroupBy = () => {
    const { router } = this.props;
    const { prefix } = this.state;

    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupByKeys = queryFromRoute?.group_by ? Object.keys(queryFromRoute.group_by) : [];

    let groupBy: string;
    for (const key of groupByKeys) {
      const index = key.indexOf(prefix);
      if (index !== -1) {
        groupBy = key.slice(prefix.length);
        break;
      }
    }
    return groupBy;
  };

  private getGroupByItems = () => {
    const { report } = this.props;

    if (!report?.data) {
      return [];
    }

    // If the key_only param is used, we have an array of strings
    let hasKeys = false;
    for (const item of report.data) {
      if (item.hasOwnProperty('key')) {
        hasKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    let data = [];
    if (hasKeys) {
      const keepData = report.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(report.data);
    }

    return data.map((item, index) => {
      const key = hasKeys ? item.key : item;
      return <SelectOption key={`${key}:${index}`} value={key} />;
    });
  };

  private handleOnClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleOnSelected = value => {
    const { onSelected } = this.props;
    const { prefix } = this.state;

    this.setState({
      currentItem: value,
      isGroupByOpen: false,
    });
    if (onSelected) {
      onSelected(`${prefix}${value}`);
    }
  };

  private handleOnToggle = isGroupByOpen => {
    this.setState({ isGroupByOpen });
  };

  public render() {
    const { isCostCategory, isDisabled, intl } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Select
          aria-label={intl.formatMessage(
            isCostCategory ? messages.filterByCostCategoryKeyAriaLabel : messages.filterByTagKeyAriaLabel
          )}
          isDisabled={isDisabled}
          onClear={this.handleOnClear}
          onSelect={(_evt, value) => this.handleOnSelected(value)}
          onToggle={(_evt, isExpanded) => this.handleOnToggle(isExpanded)}
          isOpen={isGroupByOpen}
          placeholderText={intl.formatMessage(messages.chooseKeyPlaceholder)}
          selections={currentItem}
          variant={SelectVariant.typeahead}
        >
          {this.getGroupByItems()}
        </Select>
      </div>
    );
  }
}

const GroupBySelect = injectIntl(withRouter(GroupBySelectBase));

export { GroupBySelect };
