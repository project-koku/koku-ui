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
import { setCurrency } from 'utils/sessionStorage';

import { styles } from './currency.styles';

interface CurrencyOwnProps {
  currency?: string;
  isDisabled?: boolean;
  isSessionStorage?: boolean;
  onSelect?: (value: string) => void;
  showLabel?: boolean;
}

interface CurrencyDispatchProps {
  // TBD...
}

interface CurrencyStateProps {
  // TBD...
}

interface CurrencyState {
  isSelectOpen: boolean;
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

export const currencyOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.currencyOptions, value: 'AUD' },
  { label: messages.currencyOptions, value: 'CAD' },
  { label: messages.currencyOptions, value: 'CHF' },
  { label: messages.currencyOptions, value: 'CNY' },
  { label: messages.currencyOptions, value: 'DKK' },
  { label: messages.currencyOptions, value: 'EUR' },
  { label: messages.currencyOptions, value: 'GBP' },
  { label: messages.currencyOptions, value: 'HKD' },
  { label: messages.currencyOptions, value: 'JPY' },
  { label: messages.currencyOptions, value: 'NOK' },
  { label: messages.currencyOptions, value: 'NZD' },
  { label: messages.currencyOptions, value: 'SEK' },
  { label: messages.currencyOptions, value: 'SGD' },
  { label: messages.currencyOptions, value: 'USD' },
  { label: messages.currencyOptions, value: 'ZAR' },
];

class CurrencyBase extends React.Component<CurrencyProps, CurrencyState> {
  protected defaultState: CurrencyState = {
    isSelectOpen: false,
  };
  public state: CurrencyState = { ...this.defaultState };

  private getSelect = () => {
    const { currency, isDisabled, showLabel = true } = this.props;
    const { isSelectOpen } = this.state;

    const selectOptions = this.getSelectOptions();
    const selected = selectOptions.find((option: SelectWrapperOption) => option.value === currency);

    return (
      <SelectWrapper
        id="currencySelect"
        isDisabled={isDisabled}
        isOverride={!showLabel}
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

    currencyOptions.map(option => {
      options.push({
        toString: () => intl.formatMessage(option.label, { units: option.value }),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (value: string) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set currency units via local storage
    if (isSessionStorage) {
      setCurrency(value);
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
      <div style={styles.currencySelector}>
        {showLabel && (
          <Title headingLevel="h2" size={TitleSizes.md} style={styles.currencyLabel}>
            {intl.formatMessage(messages.currency)}
          </Title>
        )}
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CurrencyOwnProps, CurrencyStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CurrencyDispatchProps = {
  // TBD...
};

const CurrencyConnect = connect(mapStateToProps, mapDispatchToProps)(CurrencyBase);
const Currency = injectIntl(CurrencyConnect);

export default Currency;
