import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface ExportsActionsOwnProps extends WrappedComponentProps {
  isDisabled?: boolean;
  onDelete();
}

interface ExportsActionsState {
  isDropdownOpen: boolean;
}

type ExportsActionsProps = ExportsActionsOwnProps;

class ExportsActionsBase extends React.Component<ExportsActionsProps> {
  protected defaultState: ExportsActionsState = {
    isDropdownOpen: false,
  };
  public state: ExportsActionsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleOnDelete = this.handleOnDelete.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  public handleOnDelete = () => {
    const { onDelete } = this.props;

    if (onDelete) {
      onDelete();
    }
  };

  public handleOnSelect = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
  };

  public handleOnToggle = (isDropdownOpen: boolean) => {
    this.setState({ isDropdownOpen });
  };

  public render() {
    const { isDisabled, intl } = this.props;
    const { isDropdownOpen } = this.state;

    const items = [
      <DropdownItem component="button" isDisabled={isDisabled} key="export-action" onClick={this.handleOnDelete}>
        {intl.formatMessage(messages.delete)}
      </DropdownItem>,
    ];

    return (
      <>
        <Dropdown
          onSelect={this.handleOnSelect}
          toggle={<KebabToggle onToggle={this.handleOnToggle} />}
          isOpen={isDropdownOpen}
          isPlain
          position="right"
          dropdownItems={items}
        />
      </>
    );
  }
}

const ExportsActions = injectIntl(ExportsActionsBase);

export { ExportsActions };
