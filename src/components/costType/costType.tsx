import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Dropdown, DropdownItem, DropdownToggle, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { getCostType, invalidateCostType, setCostType } from 'utils/localStorage';

import { styles } from './costType.styles';

interface CostTypeOwnProps {
  isDisabled?: boolean;
}

interface CostTypeState {
  currentItem: string;
  isCostTypeOpen: boolean;
}

type CostTypeProps = CostTypeOwnProps & WrappedComponentProps;

// eslint-disable-next-line no-shadow
const enum CostTypes {
  amortized = 'amortized',
  blended = 'blended',
  unblended = 'unblended',
}

export const costTypeOptions: {
  desc: MessageDescriptor;
  label: MessageDescriptor;
  value: string;
}[] = [
  { desc: messages.CostTypeUnblendedDesc, label: messages.CostTypeUnblended, value: CostTypes.unblended },
  { desc: messages.CostTypeAmortizedDesc, label: messages.CostTypeAmortized, value: CostTypes.amortized },
  { desc: messages.CostTypeBlendedDesc, label: messages.CostTypeBlended, value: CostTypes.blended },
];

class CostTypeBase extends React.Component<CostTypeProps> {
  protected defaultState: CostTypeState = {
    currentItem: CostTypes.unblended,
    isCostTypeOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  private getDropDownItems = () => {
    const { intl } = this.props;

    return costTypeOptions.map(option => (
      <DropdownItem
        component="button"
        description={intl.formatMessage(option.desc)}
        key={option.value}
        onClick={() => this.handleClick(option.value)}
      >
        {intl.formatMessage(option.label)}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { intl } = this.props;
    const { currentItem } = this.state;

    const costType = getCostType() || currentItem; // Get cost type from local storage

    switch (costType) {
      case 'amortized':
        return intl.formatMessage(messages.CostTypeAmortized);
      case 'blended':
        return intl.formatMessage(messages.CostTypeBlended);
      default:
      case 'unblended':
        return intl.formatMessage(messages.CostTypeUnblended);
    }
  };

  private getDropDown = () => {
    const { isDisabled } = this.props;
    const { isCostTypeOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <Dropdown
        id="costTypeDropdown"
        onSelect={this.handleSelect}
        toggle={
          <DropdownToggle isDisabled={isDisabled} onToggle={this.handleToggle}>
            {this.getCurrentLabel()}
          </DropdownToggle>
        }
        isOpen={isCostTypeOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private handleClick = value => {
    setCostType(value); // Set cost type via local storage
    this.setState({ currentItem: value });
  };

  private handleSelect = () => {
    this.setState({
      isCostTypeOpen: !this.state.isCostTypeOpen,
    });
  };

  private handleToggle = isCostTypeOpen => {
    this.setState({
      isCostTypeOpen,
    });
  };

  public render() {
    const { intl } = this.props;

    // Todo: Show new features in beta environment only
    if (!insights.chrome.isBeta()) {
      return null;
    }

    // Clear local storage value if current session is not valid
    invalidateCostType();

    return (
      <div style={styles.costSelector}>
        <Title headingLevel="h3" size="md" style={styles.costLabel}>
          {intl.formatMessage(messages.CostTypeLabel)}
        </Title>
        {this.getDropDown()}
      </div>
    );
  }
}

const CostType = injectIntl(CostTypeBase);
export { CostType };
