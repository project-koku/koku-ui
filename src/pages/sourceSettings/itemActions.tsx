import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  onDelete: (event) => void;
}

interface State {
  isOpen: boolean;
}

class SourceActions extends React.Component<Props, State> {
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
    const { t, onDelete } = this.props;
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={this.state.isOpen}
        isPlain
        position="right"
        dropdownItems={[
          <DropdownItem key="remove" component="button" onClick={onDelete}>
            {t('source_details.remove_source')}
          </DropdownItem>,
        ]}
      />
    );
  }
}

export default SourceActions;
