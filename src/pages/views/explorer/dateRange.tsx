import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
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
  isDateRangeOpen: boolean;
}

type DateRangeProps = DateRangeOwnProps & WrappedComponentProps;

class DateRangeBase extends React.Component<DateRangeProps> {
  protected defaultState: DateRangeState = {
    isDateRangeOpen: false,
  };
  public state: DateRangeState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { options, intl } = this.props;

    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {intl.formatMessage(option.label, { value: option.value })}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, options, intl } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = intl.formatMessage(option.label, { value: option.value });
        break;
      }
    }
    return label;
  };

  public handleClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  private handleSelect = () => {
    this.setState({
      isDateRangeOpen: !this.state.isDateRangeOpen,
    });
  };

  private handleToggle = isDateRangeOpen => {
    this.setState({
      isDateRangeOpen,
    });
  };

  public render() {
    const { isDisabled } = this.props;
    const { isDateRangeOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <Dropdown
        onSelect={this.handleSelect}
        toggle={
          <DropdownToggle isDisabled={isDisabled} onToggle={this.handleToggle}>
            {this.getCurrentLabel()}
          </DropdownToggle>
        }
        isOpen={isDateRangeOpen}
        dropdownItems={dropdownItems}
      />
    );
  }
}

const DateRange = injectIntl(DateRangeBase);

export { DateRange };
