import { Dropdown, KebabToggle } from '@patternfly/react-core';
import React from 'react';

interface Props {
  isPlain?: boolean;
  position?: 'left' | 'right';
  direction?: 'up' | 'down';
  dropdownItems: any[];
}

interface State {
  isOpen: boolean;
}

class DropdownBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  private onSelect() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  private onToggle(isOpen: boolean) {
    this.setState({ isOpen });
  }

  public render() {
    const {
      isPlain = false,
      direction = 'down',
      position = 'left',
      dropdownItems,
    } = this.props;

    return (
      <Dropdown
        isPlain={isPlain}
        position={position}
        direction={direction}
        isOpen={this.state.isOpen}
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        dropdownItems={dropdownItems}
      />
    );
  }
}

export default DropdownBase;
