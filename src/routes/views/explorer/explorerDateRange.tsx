import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface ExplorerDateRangeOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    label: MessageDescriptor;
    value: string;
  }[];
}

interface ExplorerDateRangeState {
  isSelectOpen: boolean;
}

interface ExplorerDateRangeOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type ExplorerDateRangeProps = ExplorerDateRangeOwnProps & WrappedComponentProps;

class ExplorerDateRangeBase extends React.Component<ExplorerDateRangeProps> {
  protected defaultState: ExplorerDateRangeState = {
    isSelectOpen: false,
  };
  public state: ExplorerDateRangeState = { ...this.defaultState };

  private getSelect = () => {
    const { currentItem, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: ExplorerDateRangeOption) => option.value === currentItem);

    return (
      <Select
        id="dateRangeSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getSelectOptions = (): ExplorerDateRangeOption[] => {
    const { intl, options } = this.props;

    const selectOptions: ExplorerDateRangeOption[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return selectOptions;
  };

  private handleSelect = (event, selection: ExplorerDateRangeOption) => {
    const { onItemClicked } = this.props;

    if (onItemClicked) {
      onItemClicked(selection.value);
    }
    this.setState({
      isSelectOpen: false,
    });
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    return this.getSelect();
  }
}

const ExplorerDateRange = injectIntl(ExplorerDateRangeBase);

export { ExplorerDateRange };
