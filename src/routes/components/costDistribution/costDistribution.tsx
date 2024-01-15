import './costDistribution.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { MenuToggle, Select, SelectList, SelectOption, Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { createMapStateToProps } from 'store/common';
import { setCostDistribution } from 'utils/sessionStorage';

import { styles } from './costDistribution.styles';

interface CostDistributionOwnProps {
  costDistribution?: string;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
}

interface CostDistributionDispatchProps {
  // TBD...
}

interface CostDistributionStateProps {
  // TBD...
}

interface CostDistributionState {
  isSelectOpen: boolean;
}

interface CostDistributionOption {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostDistributionProps = CostDistributionOwnProps &
  CostDistributionDispatchProps &
  CostDistributionStateProps &
  WrappedComponentProps;

const costDistributionOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.costDistributionType, value: ComputedReportItemValueType.distributed },
  { label: messages.costDistributionType, value: ComputedReportItemValueType.total },
];

class CostDistributionBase extends React.Component<CostDistributionProps, CostDistributionState> {
  protected defaultState: CostDistributionState = {
    isSelectOpen: false,
  };
  public state: CostDistributionState = { ...this.defaultState };

  private getSelect = () => {
    const { costDistribution, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostDistributionOption) => option.value === costDistribution);

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

  private getSelectOptions = (): CostDistributionOption[] => {
    const { intl } = this.props;

    const options: CostDistributionOption[] = [];

    costDistributionOptions.map(option => {
      options.push({
        toString: () => intl.formatMessage(option.label, { value: option.value }),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (value: string) => {
    const { onSelect } = this.props;

    setCostDistribution(value); // Set cost distribution in local storage

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
    const { intl } = this.props;

    return (
      <div style={styles.selector}>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.label}>
          {intl.formatMessage(messages.costDistributionLabel)}
        </Title>
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostDistributionOwnProps, CostDistributionStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CostDistributionDispatchProps = {
  // TBD...
};

const CostDistributionConnect = connect(mapStateToProps, mapDispatchToProps)(CostDistributionBase);
const CostDistribution = injectIntl(CostDistributionConnect);

export default CostDistribution;
