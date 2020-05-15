import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { styles } from './perspective.styles';

interface PerspectiveOwnProps {
  currentItem?: string;
  onItemClicked(value: string);
  options?: {
    label: string;
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
    const { options, intl } = this.props;

    return options.map(option => (
      <DropdownItem
        component="button"
        key={option.value}
        onClick={() => this.handleClick(option.value)}
      >
        {intl.formatMessage({ id: option.label })}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { currentItem, options, intl } = this.props;

    let label = '';
    for (const option of options) {
      if (currentItem === option.value) {
        label = intl.formatMessage({ id: option.label });
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

  private handleSelect = event => {
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
    const { isPerspectiveOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <div style={styles.perspectiveSelector}>
        <label style={styles.perspectiveLabel}>
          {intl.formatMessage({ id: 'overview.perspective.label' })}
        </label>
        <Dropdown
          onSelect={this.handleSelect}
          toggle={
            <DropdownToggle onToggle={this.handleToggle}>
              {this.getCurrentLabel()}
            </DropdownToggle>
          }
          isOpen={isPerspectiveOpen}
          dropdownItems={dropdownItems}
        />
      </div>
    );
  }
}

const Perspective = injectIntl(PerspectiveBase);

export { Perspective };
