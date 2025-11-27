import type { MessageDescriptor } from '@formatjs/intl/src/types';
import messages from '@koku-ui/i18n/locales/messages';
import { Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { setCurrency } from '../../../utils/sessionStorage';
import type { SelectWrapperOption } from '../selectWrapper';
import { SelectWrapper } from '../selectWrapper';
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
  // TBD...
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

export const currencyOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.currencyOptions, value: 'AUD' },
  { label: messages.currencyOptions, value: 'BRL' },
  { label: messages.currencyOptions, value: 'CAD' },
  { label: messages.currencyOptions, value: 'CHF' },
  { label: messages.currencyOptions, value: 'CNY' },
  { label: messages.currencyOptions, value: 'CZK' },
  { label: messages.currencyOptions, value: 'DKK' },
  { label: messages.currencyOptions, value: 'EUR' },
  { label: messages.currencyOptions, value: 'GBP' },
  { label: messages.currencyOptions, value: 'HKD' },
  { label: messages.currencyOptions, value: 'INR' },
  { label: messages.currencyOptions, value: 'JPY' },
  { label: messages.currencyOptions, value: 'NGN' },
  { label: messages.currencyOptions, value: 'NOK' },
  { label: messages.currencyOptions, value: 'NZD' },
  { label: messages.currencyOptions, value: 'SEK' },
  { label: messages.currencyOptions, value: 'SGD' },
  { label: messages.currencyOptions, value: 'USD' },
  { label: messages.currencyOptions, value: 'ZAR' },
];

class CurrencyBase extends React.Component<CurrencyProps, CurrencyState> {
  protected defaultState: CurrencyState = {
    // TBD...
  };
  public state: CurrencyState = { ...this.defaultState };

  private getSelect = () => {
    const { currency, isDisabled, showLabel = true } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === currency);

    return (
      <SelectWrapper
        id="currency-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        position={showLabel ? 'right' : undefined}
        selection={selection}
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

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set currency units via local storage
    if (isSessionStorage) {
      setCurrency(selection.value);
    }
    if (onSelect) {
      onSelect(selection.value);
    }
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
