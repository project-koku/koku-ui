import type { MessageDescriptor } from '@formatjs/intl/src/types';
import messages from '@koku-ui/i18n/locales/messages';
import { Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { setCostDistribution } from '../../../utils/sessionStorage';
import { ComputedReportItemValueType } from '../charts/common';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectWrapper } from '../selectWrapper';
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
  // TBD...
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
    // TBD...
  };
  public state: CostDistributionState = { ...this.defaultState };

  private getSelect = () => {
    const { costDistribution, isDisabled } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === costDistribution);

    return (
      <SelectWrapper
        id="cost-distribution-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        selection={selection}
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

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { onSelect } = this.props;

    setCostDistribution(selection.value); // Set cost distribution in local storage

    if (onSelect) {
      onSelect(selection.value);
    }
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
