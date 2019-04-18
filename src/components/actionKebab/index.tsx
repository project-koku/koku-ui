import { Dropdown, KebabToggle } from '@patternfly/react-core';
import React from 'react';

interface Props {
  actions: React.ReactNode[];
}

interface State {
  isOpen: boolean;
}

class ActionKebab extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  public onToggle(isOpen: boolean) {
    this.setState({ isOpen });
  }

  public onSelect() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  public render() {
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={this.state.isOpen}
        isPlain
        position="right"
        dropdownItems={this.props.actions}
      />
    );
  }
}

export default ActionKebab;
