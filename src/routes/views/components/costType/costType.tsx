import './costType.scss';

import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { CostTypes } from 'utils/costType';
import { invalidateSession, restoreCostType, setCostType } from 'utils/localStorage';

import { styles } from './costType.styles';

interface CostTypeOwnProps {
  costType: CostTypes;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
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

interface CostTypeOption extends SelectOptionObject {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostTypeProps = CostTypeOwnProps & CostTypeDispatchProps & CostTypeStateProps & WrappedComponentProps;

const costTypeOptions: {
  desc: MessageDescriptor;
  label: MessageDescriptor;
  value: string;
}[] = [
  { desc: messages.costTypeAmortizedDesc, label: messages.costTypeAmortized, value: CostTypes.amortized },
  { desc: messages.costTypeBlendedDesc, label: messages.costTypeBlended, value: CostTypes.blended },
  { desc: messages.costTypeUnblendedDesc, label: messages.costTypeUnblended, value: CostTypes.unblended },
];

class CostTypeBase extends React.Component<CostTypeProps> {
  protected defaultState: CostTypeState = {
    isSelectOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelect = () => {
    const { costType, isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    // Restore from query param if available
    restoreCostType();

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostTypeOption) => option.value === costType);

    return (
      <Select
        className="selectOverride"
        id="costTypeSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption description={option.desc} key={option.value} value={option} />
        ))}
      </Select>
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

  private handleSelect = (event, selection: CostTypeOption) => {
    const { onSelect } = this.props;

    setCostType(selection.value); // Set cost type in local storage

    this.setState(
      {
        isSelectOpen: false,
      },
      () => {
        if (onSelect) {
          onSelect(selection.value);
        }
      }
    );
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

    // Clear local storage value if current session is not valid
    invalidateSession();

    return (
      <div style={styles.costSelector}>
        <Title headingLevel="h3" size="md" style={styles.costLabel}>
          {intl.formatMessage(messages.costTypeLabel)}
        </Title>
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
