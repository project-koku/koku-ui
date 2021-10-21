import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface DateRangeOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    label: MessageDescriptor;
    value: string;
  }[];
}

interface DateRangeState {
  isSelectOpen: boolean;
}

interface DateRangeOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type DateRangeProps = DateRangeOwnProps & WrappedComponentProps;

class DateRangeBase extends React.Component<DateRangeProps> {
  protected defaultState: DateRangeState = {
    isSelectOpen: false,
  };
  public state: DateRangeState = { ...this.defaultState };

  private getSelect = () => {
    const { currentItem, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: DateRangeOption) => option.value === currentItem);

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

  private getSelectOptions = (): DateRangeOption[] => {
    const { intl, options } = this.props;

    const selectOptions: DateRangeOption[] = [];

    options.map(option => {
      selectOptions.push({
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return selectOptions;
  };

  private handleSelect = (event, selection: DateRangeOption) => {
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

const DateRange = injectIntl(DateRangeBase);

export { DateRange };
