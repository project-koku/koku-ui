import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface DataKebabOwnProps {
  isDisabled?: boolean;
  options?: {
    label: MessageDescriptor;
    onClick: () => void;
  }[];
}

interface DataKebabState {
  isKebabOpen: boolean;
}

type DataKebabProps = DataKebabOwnProps & WrappedComponentProps;

class DataKebabBase extends React.Component<DataKebabProps, DataKebabState> {
  protected defaultState: DataKebabState = {
    isKebabOpen: false,
  };
  public state: DataKebabState = { ...this.defaultState };

  private getDropdownItems = () => {
    const { intl, options } = this.props;

    const dropdownItems = [];

    options.map((option, index) => {
      dropdownItems.push(
        <DropdownItem key={index} onClick={option.onClick}>
          {intl.formatMessage(option.label)}
        </DropdownItem>
      );
    });
    return dropdownItems;
  };

  public handleOnSelect = () => {
    const { isKebabOpen } = this.state;
    this.setState({
      isKebabOpen: !isKebabOpen,
    });
  };

  private handleOnToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen,
    });
  };

  public render() {
    const { isDisabled } = this.props;
    const { isKebabOpen } = this.state;

    return (
      <Dropdown
        dropdownItems={this.getDropdownItems()}
        isOpen={isKebabOpen}
        isPlain
        onSelect={this.handleOnSelect}
        position={DropdownPosition.right}
        toggle={<KebabToggle isDisabled={isDisabled} onToggle={this.handleOnToggle} />}
      />
    );
  }
}

const DataKebab = injectIntl(DataKebabBase);

export { DataKebab };
