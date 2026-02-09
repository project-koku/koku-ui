import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { Resource } from 'api/resources/resource';
import type { Tag } from 'api/tags/tag';
import messages from 'locales/messages';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectTypeaheadWrapper } from 'routes/components/selectWrapper';
import { tagPrefix } from 'utils/props';
import { awsCategoryPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';

interface GroupBySelectOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy?: string;
  isCostCategory?: boolean;
  isDisabled?: boolean;
  onSelect(value: string);
  report: Resource | Tag;
}

interface GroupBySelectState {
  currentItem?: string;
  prefix?: string;
}

type GroupBySelectProps = GroupBySelectOwnProps;

class GroupBySelectBase extends React.Component<GroupBySelectProps, GroupBySelectState> {
  protected defaultState: GroupBySelectState = {
    prefix: this.props.isCostCategory ? awsCategoryPrefix : tagPrefix,
  };
  public state: GroupBySelectState = { ...this.defaultState };

  constructor(props: GroupBySelectProps) {
    super(props);
    this.handleOnClear = this.handleOnClear.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
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

  private getGroupByItems = (): SelectWrapperOption[] => {
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
    let data: any[] = uniq(report.data);
    if (hasKeys) {
      const keepData = report.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    }

    return data.map(item => {
      const key = hasKeys ? item.key : item;
      return {
        toString: () => key,
        value: key,
      };
    });
  };

  private handleOnClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelect } = this.props;
    const { prefix } = this.state;

    this.setState({
      currentItem: selection.value,
    });
    if (onSelect) {
      onSelect(`${prefix}${selection.value}`);
    }
  };

  public render() {
    const { isCostCategory, isDisabled, intl } = this.props;
    const { currentItem } = this.state;

    const selectOptions = this.getGroupByItems();
    const selection = selectOptions.find(option => option.value === currentItem);

    return (
      <div style={styles.groupBySelector}>
        <SelectTypeaheadWrapper
          ariaLabel={intl.formatMessage(
            isCostCategory ? messages.filterByCostCategoryKeyAriaLabel : messages.filterByTagKeyAriaLabel
          )}
          id="group-by-select-typeahead"
          isDisabled={isDisabled}
          onClear={this.handleOnClear}
          onSelect={this.handleOnSelect}
          options={selectOptions}
          placeholder={intl.formatMessage(messages.chooseKeyPlaceholder)}
          selection={selection}
        />
      </div>
    );
  }
}

const GroupBySelect = injectIntl(withRouter(GroupBySelectBase));

export { GroupBySelect };
