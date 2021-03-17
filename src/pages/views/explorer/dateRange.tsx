import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface DateRangeOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    label: string;
    value: string;
  }[];
}

interface DateRangeState {
  isDateRangeOpen: boolean;
}

type DateRangeProps = DateRangeOwnProps & WithTranslation;

class DateRangeBase extends React.Component<DateRangeProps> {
  protected defaultState: DateRangeState = {
    isDateRangeOpen: false,
  };
  public state: DateRangeState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { options, t } = this.props;

    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {t(option.label)}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, options, t } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = t(option.label);
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

const DateRange = withTranslation()(DateRangeBase);

export { DateRange };
