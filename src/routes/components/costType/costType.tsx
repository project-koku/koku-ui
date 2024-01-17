import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
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
  // TBD...
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
    // TBD...
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelect = () => {
    const { costType = CostTypes.unblended, isDisabled } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: SelectWrapperOption) => option.value === costType);

    return (
      <SelectWrapper
        id="costTypeSelect"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        selections={selection}
        selectOptions={selectOptions}
      />
    );
  };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { intl } = this.props;

    const options: SelectWrapperOption[] = [];

    costTypeOptions.map(option => {
      options.push({
        desc: intl.formatMessage(option.desc),
        toString: () => intl.formatMessage(option.label),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (_evt, value: string) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set cost type in local storage
    if (isSessionStorage) {
      setCostType(value);
    }
    if (onSelect) {
      onSelect(value);
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
