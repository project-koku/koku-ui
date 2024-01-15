import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
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
    const selected = selectOptions.find((option: SelectWrapperOption) => option.value === costDistribution);

    return (
      <SelectWrapper
        id="costDistributionSelect"
        isDisabled={isDisabled}
        onToggle={this.handleOnToggle}
        onSelect={this.handleOnSelect}
        position="right"
        isOpen={isSelectOpen}
        selected={selected}
        selectOptions={selectOptions}
      />
    );
  };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { intl } = this.props;

    const options: SelectWrapperOption[] = [];

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
