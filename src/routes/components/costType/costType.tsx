import './costType.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { MenuToggle, Select, SelectList, SelectOption, Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { setCostType } from 'utils/sessionStorage';

import { styles } from './costType.styles';

interface CostTypeOwnProps {
  costType?: string;
  isDisabled?: boolean;
  isSessionStorage?: boolean;
  onSelect?: (value: string) => void;
  showLabel?: boolean;
}

interface CostTypeDispatchProps {
  // TBD...
}

interface CostTypeStateProps {
  // TBD...
}

interface CostTypeState {
  isSelectOpen: boolean;
}

interface CostTypeOption {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostTypeProps = CostTypeOwnProps & CostTypeDispatchProps & CostTypeStateProps & WrappedComponentProps;

// eslint-disable-next-line no-shadow
export const enum CostTypes {
  amortized = 'calculated_amortized_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

const costTypeOptions: {
  desc: MessageDescriptor;
  label: MessageDescriptor;
  value: string;
}[] = [
  { desc: messages.costTypeAmortizedDesc, label: messages.costTypeAmortized, value: CostTypes.amortized },
  { desc: messages.costTypeBlendedDesc, label: messages.costTypeBlended, value: CostTypes.blended },
  { desc: messages.costTypeUnblendedDesc, label: messages.costTypeUnblended, value: CostTypes.unblended },
];

class CostTypeBase extends React.Component<CostTypeProps, CostTypeState> {
  protected defaultState: CostTypeState = {
    isSelectOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelect = () => {
    const { costType = CostTypes.unblended, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostTypeOption) => option.value === costType);

    const toggle = toggleRef => (
      <MenuToggle
        isDisabled={isDisabled}
        ref={toggleRef}
        onClick={() => this.handleOnToggle(!isSelectOpen)}
        isExpanded={isSelectOpen}
      >
        {selection?.toString()}
      </MenuToggle>
    );
    return (
      <div className="selectOverride">
        <Select
          id="costDistributionSelect"
          onOpenChange={isExpanded => this.handleOnToggle(isExpanded)}
          onSelect={(_evt, value) => this.handleOnSelect(value as string)}
          isOpen={isSelectOpen}
          selected={selection}
          toggle={toggle}
        >
          <SelectList>
            {selectOptions.map(option => (
              <SelectOption key={option.value} value={option.value}>
                {option.toString()}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </div>
    );
  };

  private getSelectOptions = (): CostTypeOption[] => {
    const { intl } = this.props;

    const options: CostTypeOption[] = [];

    costTypeOptions.map(option => {
      options.push({
        desc: intl.formatMessage(option.desc),
        toString: () => intl.formatMessage(option.label),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (value: string) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set cost type in local storage
    if (isSessionStorage) {
      setCostType(value);
    }
    this.setState(
      {
        isSelectOpen: false,
      },
      () => {
        if (onSelect) {
          onSelect(value);
        }
      }
    );
  };

  private handleOnToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl, showLabel = true } = this.props;

    return (
      <div style={styles.costSelector}>
        {showLabel && (
          <Title headingLevel="h2" size={TitleSizes.md} style={styles.costLabel}>
            {intl.formatMessage(messages.costTypeLabel)}
          </Title>
        )}
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostTypeOwnProps, CostTypeStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CostTypeDispatchProps = {
  // TBD...
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(CostTypeBase);
const CostType = injectIntl(CostTypeConnect);

export default CostType;
