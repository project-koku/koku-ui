import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { styles } from './perspective.styles';

interface PerspectiveOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options?: {
    label: MessageDescriptor;
    value: string;
  }[];
}

interface PerspectiveState {
  isPerspectiveOpen: boolean;
}

type PerspectiveProps = PerspectiveOwnProps & WrappedComponentProps;

class PerspectiveBase extends React.Component<PerspectiveProps> {
  protected defaultState: PerspectiveState = {
    isPerspectiveOpen: false,
  };
  public state: PerspectiveState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { intl, options } = this.props;

    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {intl.formatMessage(option.label, { value: option.value })}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, intl, options } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = intl.formatMessage(option.label, { value: option.value });
        break;
      }
    }
    return label;
  };

  private getDropDown = () => {
    const { intl, isDisabled, options } = this.props;
    const { isPerspectiveOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    if (options.length === 1) {
      return (
        <div style={styles.perspectiveOptionLabel}>
          {intl.formatMessage(options[0].label, { value: options[0].value })}
        </div>
      );
    }
    return (
      <Dropdown
        id="perspectiveDropdown"
        onSelect={this.handleSelect}
        toggle={
          <DropdownToggle isDisabled={isDisabled} onToggle={this.handleToggle}>
            {this.getCurrentLabel()}
          </DropdownToggle>
        }
        isOpen={isPerspectiveOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private handleClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(value);
    }
  };

  private handleSelect = () => {
    this.setState({
      isPerspectiveOpen: !this.state.isPerspectiveOpen,
    });
  };

  private handleToggle = isPerspectiveOpen => {
    this.setState({
      isPerspectiveOpen,
    });
  };

  public render() {
    const { intl } = this.props;

    return (
      <div style={styles.perspectiveSelector}>
        <label htmlFor="perspectiveDropdown" style={styles.perspectiveLabel}>
          {intl.formatMessage(messages.Perspective)}
        </label>
        {this.getDropDown()}
      </div>
    );
  }
}

const Perspective = injectIntl(PerspectiveBase);

export { Perspective };
