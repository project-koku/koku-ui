import type { MessageDescriptor } from '@formatjs/intl/src/types';
import messages from '@koku-ui/i18n/locales/messages';
import { Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { setCostType } from '../../../utils/sessionStorage';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectWrapper } from '../selectWrapper';
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
  // TBD...
}

type CostTypeProps = CostTypeOwnProps & CostTypeDispatchProps & CostTypeStateProps & WrappedComponentProps;

export const enum CostTypes {
  amortized = 'calculated_amortized_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

const costTypeOptions: {
  description: MessageDescriptor;
  label: MessageDescriptor;
  value: string;
}[] = [
  { description: messages.costTypeAmortizedDesc, label: messages.costTypeAmortized, value: CostTypes.amortized },
  { description: messages.costTypeBlendedDesc, label: messages.costTypeBlended, value: CostTypes.blended },
  { description: messages.costTypeUnblendedDesc, label: messages.costTypeUnblended, value: CostTypes.unblended },
];

class CostTypeBase extends React.Component<CostTypeProps, CostTypeState> {
  protected defaultState: CostTypeState = {
    // TBD...
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelect = () => {
    const { costType = CostTypes.unblended, isDisabled } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === costType);

    return (
      <SelectWrapper
        id="cost-type-select"
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

    costTypeOptions.map(option => {
      options.push({
        description: intl.formatMessage(option.description),
        toString: () => intl.formatMessage(option.label),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set cost type in local storage
    if (isSessionStorage) {
      setCostType(selection.value);
    }
    if (onSelect) {
      onSelect(selection.value);
    }
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
