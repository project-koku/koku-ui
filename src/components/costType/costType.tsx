import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
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
  isSelectOpen: boolean;
}

interface CostTypeOption extends SelectOptionObject {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostTypeProps = CostTypeOwnProps & WrappedComponentProps;

// eslint-disable-next-line no-shadow
const enum CostTypes {
  amortized = 'amortized',
  blended = 'blended',
  unblended = 'unblended',
}

class CostTypeBase extends React.Component<CostTypeProps> {
  protected defaultState: CostTypeState = {
    currentItem: CostTypes.unblended,
    isSelectOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelectOptions = (): CostTypeOption[] => {
    const { intl } = this.props;

    const options: CostTypeOption[] = [
      {
        desc: intl.formatMessage(messages.CostTypeUnblendedDesc),
        toString: () => intl.formatMessage(messages.CostTypeUnblended),
        value: CostTypes.unblended,
      },
      {
        desc: intl.formatMessage(messages.CostTypeAmortizedDesc),
        toString: () => intl.formatMessage(messages.CostTypeAmortized),
        value: CostTypes.amortized,
      },
      {
        desc: intl.formatMessage(messages.CostTypeBlendedDesc),
        toString: () => intl.formatMessage(messages.CostTypeBlended),
        value: CostTypes.blended,
      },
    ];
    return options;
  };

  private getCurrentItem = () => {
    const { currentItem } = this.state;

    const costType = getCostType(); // Get currency units from local storage
    return costType ? costType : currentItem;
  };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const currentItem = this.getCurrentItem();
    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((item: CostTypeOption) => item.value === currentItem);

    return (
      <Select
        id="costTypeSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(item => (
          <SelectOption key={item.value} value={item} />
        ))}
      </Select>
    );
  };

  private handleSelect = (event, selection: CostTypeOption) => {
    this.setState({
      currentItem: selection.value,
      isSelectOpen: false,
    });
    setCostType(selection.value); // Set currency units via local storage
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
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
        {this.getSelect()}
      </div>
    );
  }
}

const CostType = injectIntl(CostTypeBase);
export { CostType };
